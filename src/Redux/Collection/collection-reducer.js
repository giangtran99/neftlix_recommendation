const INITIAL_STATE = {
  collection: [
    {
      id: 1,
      title: "Phổ biến",
      start: 0,
      end: 10
    },
    {
      id: 2,
      title: "Top lượt đánh giá cao",
      start: 10,
      end: 20
    },
    {
      id: 3,
      title: "Doanh thu cao nhất",
      start: 20,
      end: 30
    },
    {
      id: 4,
      title: "Mới phát hành",
      start: 30,
      end: 40
    },
    {
      id: 5,
      title: "Nhiều lượt thích nhất",
      start: 40,
      end: 50
    },
    {
      id: 6,
      title: "Top Xu hướng",
      start: 50,
      end: 60
    },
    {
      id: 7,
      title: "Có thể bạn sẽ thích",
      start: 60,
      end: 70
    },
  ]
};

const collectionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default collectionReducer;
