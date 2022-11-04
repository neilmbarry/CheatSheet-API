module.exports = class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B. Advanced filtering

    console.log(queryObj.nameSearch, '<<<<<<<<<<<<,');

    // queryObj.name = { $regex: '^M', $options: 'i' };

    if (queryObj.nameSearch) {
      queryObj.name = { $regex: `.*${queryObj.nameSearch}.*`, $options: 'i' };
    }

    // console.log(queryObj);

    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    // const myQuery = `"${queryObj.nameSearch}"`;
    // const myUpdateQuery = `"${queryObj.nameSearch}"`;
    // const re = new RegExp(myQuery, 'g');

    // queryString = queryString.replace(/\b(nameSearch)\b/g, `name`);
    // queryString = queryString.replace(re, myUpdateQuery);

    // console.log(queryString, '<--- queryString');

    // console.log('JSON.parse(QS) ======>', JSON.parse(queryString));

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('name');
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
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 5;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
};
