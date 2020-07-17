module.exports = (model, data) => ({
  create: async (props = {}) => {
    const dataProps = data(props);

    if (dataProps instanceof Promise) {
      return model.create(await dataProps);
    }

    return model.create(dataProps);
  },
  bulkCreate: async (count, props = {}) => {
    const arrObj = [];

    for (let i = 0; i < count; i += 1) {
      arrObj.push(data(props));
    }

    return model.bulkCreate(await Promise.all(arrObj));
  },
});
