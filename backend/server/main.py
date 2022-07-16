
from fastapi import FastAPI #import class FastAPI() từ thư viện fastapi
import numpy as np
import pandas as pd
import pymongo 
from random import randint
from sklearn.model_selection import train_test_split
import database
from pymongo import MongoClient
from bson import ObjectId,DBRef
import json
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel,Field
import motor.motor_asyncio
from fastapi.responses import JSONResponse

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class Link(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    imdbId:int
    tmdbId:int
    movieLensId:int
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class Movie(BaseModel):
    id:int = Field(alias='_id')
    original_title: str = None
    budget: int = None
    popularity: float = None
    revenue:int = None
    homepage:str = None
    director:str = None
    tagline:str = None
    overview:str = None
    runtime:int = None
    release_date:str = None
    vote_count:int = None
    vote_average:float = None
    release_year:int = None
    budget_adj:float = None
    revenue_adj:float = None
    imdb_id:str = None
    genres: list = None
    production_companies:list = None
    keywords: list = None
    cast:list = None

app = FastAPI() # gọi constructor và gán vào biến app
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_headers=origins,
    allow_methods=origins,
)
client = database.get_database()
client2 = motor.motor_asyncio.AsyncIOMotorClient()


# CLIEN API
THRESH_HOLD_RATING = 3.2
@app.get("/",response_description="List all students") # giống flask, khai báo phương thức get và url
async def root(): # do dùng ASGI nên ở đây thêm async, nếu bên thứ 3 không hỗ trợ thì bỏ async đi
    return {"message": "Hello World"}

@app.get("/reccomend-item/{user_id}",response_model=List[Link])
async def reccomend_item(user_id):
    print("user_id",user_id)
    #read file
    X = np.genfromtxt('../Matrix_X.csv',delimiter=',')
    W = np.genfromtxt('../Matrix_W.csv',delimiter=',')
    mu = np.genfromtxt('../Matrix_Mu.csv',delimiter=',')
    r_cols = ['user_id', 'movie_id', 'rating', 'unix_timestamp']
    rating = pd.read_csv('../Matrix_Y_rating.csv', sep=',')
    ratings_base = rating.values.astype(int)
    # ratings_base[:, :2]-= 1
    #reccommend
    ids = np.where(ratings_base[:, 0] == int(user_id))[0]
    items_rated_by_u = ratings_base[ids, 1].tolist()    
    n_items = int(np.max(ratings_base[:, 1])) + 1
    y_pred = X.dot(W[:, int(user_id)]) + mu[int(user_id)]
    predicted_ratings = []
    ids_movies = [] 
    for i in range(n_items):
        if i not in items_rated_by_u:
            predicted_ratings.append([i, y_pred[i]])   
            ids_movies.append(i)
    predArr = np.array(predicted_ratings)
    full = predArr[predArr[:, 1].argsort()]
    top_10 = predArr[predArr[:, 1].argsort()][-9:].tolist()
    ids_movies = predArr[predArr[:, 1].argsort()][-9:][:,0].astype(int).tolist()
    print(ids_movies)
    print("reccomend",top_10)
    tmdbIds = list(client["widerMoviesDB"]["links"].find({ "movieLensId" : { "$in" : ids_movies } }).limit(10).skip(0))
    return tmdbIds


# @app.get("/rated-item-by-user/{user_id}")
# async def rated_item_by_user(user_id,skip: int = 0, limit: int = 10):
#     rating = pd.read_csv('../data/ratings.csv', sep=',')
#     ratings_base = rating.values.astype(int)
#     print("$$ids",ratings_base)
#     ids = np.where(ratings_base[:,0] == int(user_id))[0] 
#     item_ids = ratings_base[ids, 1]
#     print("$$ids",item_ids)
#     rated_item_by_user = list(client["moviesDB"]["movies"].find({ "_id" : { "$in" : item_ids.tolist() } } ).limit(limit).skip(skip))
#     return {"rated_item_by_user": rated_item_by_user}

# ADMIN API

# movie api
@app.post("/api/movie/{movie_id}")
async def update_movie(movie_id,movie:Movie):
    movieJson = jsonable_encoder(movie)
    client["tmdbMoviesDB"]["movies"].update_one({"_id": int(movie_id)}, {"$set": movieJson})
    return {"_id":int(movie_id)}

@app.post("/api/movie")
async def add_movie(movie:Movie):
    # print("$$body",movie)
    movieJson = jsonable_encoder(movie)
    print("movieJson",movie)
    client["tmdbMoviesDB"]["movies"].insert_one(movieJson)
    return {"_id":movie.id}

@app.get("/api/movie/{movie_id}")
async def get_movie(movie_id):
    movie = client["tmdbMoviesDB"]["movies"].find_one({"_id":int(movie_id)})
    return movie

@app.delete("/api/movie/{movie_id}")
async def delete_item(movie_id):
    client["tmdbMoviesDB"]["movies"].delete_one({"_id":int(movie_id)})
    return {"code":0}

@app.get("/api/movies",response_model=List[Movie])
async def get_movies(skip: int = 0, limit: int = 10,query = "{}"):
    x = json.loads(query)
    if 'text' in x:
        movies = await client2["tmdbMoviesDB"]["movies"].find({"$text": { "$search": x["text"] } }).skip(skip).limit(limit).to_list(13000)
    else:
        movies = await client2["tmdbMoviesDB"]["movies"].find({}).skip(skip).limit(limit).to_list(13000)
    return movies

@app.get("/api/movies/count")
async def get_movies(skip: int = 0, limit: int = 10,query = "{}"):
    x = json.loads(query)
    if 'text' in x:
        movies = await client2["tmdbMoviesDB"]["movies"].find({"$text": { "$search": x["text"] }}).to_list(13000)
        total = len(movies)
        print(total)
    else:
        total = await client2["tmdbMoviesDB"]["movies"].count_documents({})
    return total

