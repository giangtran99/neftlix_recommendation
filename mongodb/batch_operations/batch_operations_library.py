__author__ = 'Giorgia'
from pymongo import UpdateOne
from pymongo.errors import BulkWriteError, WriteError
import csv
from bson.dbref import DBRef
from constants import *
import pandas as pd
"""
-------------------------------------------LOADING RATINGS COLLECTION-------------------------------------------
"""


def load_ratings_from_csv(source_file, collection):
    with open(source_file, newline='\n', encoding='utf8') as csv_file:
        data = csv.reader(csv_file)
        outcome = []
        next(data)
        for row in data:
            i = 0
            current_document_to_insert = {}
            for field in ratings_fields:
                    try:
                        current_document_to_insert[field] = int(row[i])
                    except ValueError:
                        current_document_to_insert[field] = row[i]
                    i += 1

            outcome.append(current_document_to_insert)

    try:
        collection.insert_many(outcome)
        return True
    except BulkWriteError:
        return False


"""-------------------------------------------LOADING MOVIES COLLECTION----------------------------------------------"""


def load_users_from_csv(source_file, collection):
    with open(source_file, newline='\n', encoding='utf8') as csv_file:
        data = csv.reader(csv_file)
        outcome = []
        next(data)
        for row in data:
            i = 0
            current_document_to_insert = {}
            for field in users_fields:
                    try:
                        current_document_to_insert[field] = int(row[i])
                    except ValueError:
                        current_document_to_insert[field] = row[i]
                    i += 1
            outcome.append(current_document_to_insert)

    try:
        collection.insert_many(outcome)
        return True
    except BulkWriteError:
        return False


def load_movies_from_csv(source_file, collection):
    with open(source_file, newline='\n', encoding='utf8') as csv_file:
        data = csv.reader(csv_file,delimiter =":")
        print("data",data)
        outcome = []
        next(data)
        for row in data:
            i = 0
            current_document_to_insert = {}
            for field in movies_fields:
                if field == genres:
                    current_document_to_insert[field] = row[i].split('|')
                else:
                    try:
                        current_document_to_insert[field] = int(row[i])
                    except ValueError:
                        current_document_to_insert[field] = row[i]
                i += 1
            outcome.append(current_document_to_insert)
    # print("outcome",outcome)
    """As mentioned before, this only works when the file we are reading from is relatively small. """
    try:
        collection.insert_many(outcome, ordered=False)
        return True
    except BulkWriteError:
        return False


"""-------------------------------------- LOADING TAGS COLLECTION----------------------------------------------------"""



"""-----------------------------------------------UPDATING MOVIES WITH NEW TAGS---------------------------------"""


def remove_movie_id_field(tag_document_list):
    for tag_document in tag_document_list:
        del tag_document[movieId]


def update_movies_add_tags(movies_collection, tags_collection):
    for movie in list(movies_collection.find()):
        tags = list(tags_collection.find({movieId: movie[ID_Field]}))
        if len(tags) != 0:
            remove_movie_id_field(tags)
            try:
                movies_collection.update({ID_Field: movie[ID_Field]}, {"$set": {movies_field_tags: tags}}, upsert=False)
            except WriteError:
                return False
    return True

""""-------------------------------------UPDATING MOVIES WITH NEW CALCULATED FIELDS--------------------------------"""

"""This for loop has been wrapped into a function so that we don't have to add an other for in the already two 
 nested for loops int the lines below. """


def find_in_group_result(list_of_documents, identifier):
    for d in list_of_documents:
        if d[ID_Field] == identifier:
            return d
    return 0


def update_movies_add_calculated(movies_collection, group_result_from_ratings):
    for movie in list(movies_collection.find()):
        calculated_fields = find_in_group_result(group_result_from_ratings, movie[ID_Field])
        if calculated_fields != 0:
            try:
                movies_collection.bulk_write([
                    UpdateOne({ID_Field: movie[ID_Field]},
                              {'$set': {movies_field_avg: round(calculated_fields['averageRating'], 2)}},
                              upsert=False),
                    UpdateOne({ID_Field: movie[ID_Field]}, {'$set': {movies_field_count: calculated_fields['count']}},
                              upsert=False)])
            except WriteError:
                return False
    return True


""" ----------------------------------------------LOADING LINKS IN AN OTHER DATABASE-------------------------------"""


def load_links_from_csv(source_file, collection, movies_collection, movies_database):
    with open(source_file, newline='\n', encoding='utf8') as csv_file:
        data = csv.reader(csv_file)
        outcome = []
        next(data)
        for row in data:
            i = 0
            current_document_to_insert = {}
            for field in links_fields:
                if field == movieLensId:
                    current_document_to_insert[field] = int(row[i])
                else:
                    try:
                        current_document_to_insert[field] = int(row[i])
                    except ValueError:
                        current_document_to_insert[field] = row[i]
                i += 1

            outcome.append(current_document_to_insert)

    try:
        collection.insert_many(outcome, ordered=False)
        return True
    except BulkWriteError:
        return False


""" ----------------------------------------------LOADING TMDB_MOVIES IN AN OTHER DATABASE-------------------------------"""


def load_tmdbMovies_from_csv(source_file, collection):
    reader = pd.read_csv(source_file)   
    outcome = []
    for i, row in reader.iterrows():
        # print("row",row["imdb_id"])
        current_document_to_insert = {}
        for field in tmdb_movies_fields:
            if field == 'genres':
                    current_document_to_insert[field] = str(row[field]).split('|')
            elif field == "cast":
                    current_document_to_insert[field] = str(row[field]).split('|')
            elif field == "keywords":
                    current_document_to_insert[field] = str(row[field]).split('|')
            elif field == "production_companies":
                    current_document_to_insert[field] = str(row[field]).split('|')
            else:
                try:
                    current_document_to_insert[field] = row[field]
                except IndexError:
                    current_document_to_insert[field] = row[field]
        outcome.append(current_document_to_insert)
    try:
        collection.insert_many(outcome, ordered=False)
        return True
    except BulkWriteError:
        return False

    # with open(r"data/tmdb-movies.csv", newline='\n', encoding='utf8') as csv_file:
    #     data = csv.reader(csv_file,delimiter ="^",quotechar='"')
    #     outcome = []
    #     next(data)
    #     for row in data:
    #         i = 0
    #         current_document_to_insert = {}
    #         for field in tmdb_movies_fields:
    #             if field == 'genres':
    #                 current_document_to_insert[field] = row[i].split('|')
    #             if field == "cast":
    #                 current_document_to_insert[field] = row[i].split('|')
    #             if field == "keywords":
    #                 current_document_to_insert[field] = row[i].split('|')
    #             else:
    #                 try:
    #                     current_document_to_insert[field] = row[i]
    #                 except IndexError:
    #                     current_document_to_insert[field] = row[i]
    #             i += 1
    #         outcome.append(current_document_to_insert)
    # """As mentioned before, this only works when the file we are reading from is relatively small. """
    # try:
    #     collection.insert_many(outcome, ordered=False)
    #     return True
    # except BulkWriteError:
    #     return False

