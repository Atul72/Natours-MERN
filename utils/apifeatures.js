class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryobj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryobj[el]);

    // 1B) Advanced Filtering

    let queryStr = JSON.stringify(queryobj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //.replace() JavaScript String function
    // console.log(JSON.parse(queryStr));
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy); // it gives the nicely formatted array.
      this.query = this.query.sort(sortBy); //sort() function here and and where and what you want to sort and rest of the things mogoose do for you. If sort in descending order use ( - ). 127.0.0.1:8000/api/v1/tours?sort=-price
      // sort('price ratingsAverage');
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    // page=2&limit=10, 1-10 , page 1, 11-20 , page 2, 21-30, page 3
    this.query = this.query.skip(skip).limit(limit); //skip() is amount of results that should be skipped before actually querying the data.

    return this;
  }
}
module.exports = APIFeatures;
