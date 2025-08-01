import moment from "moment";

export const formatArray = {
  useInfiniteQuery: (page, key = "data") => {
    let newPages = [];
    if (!page || !page[0]) return newPages;
    for (let items of page) {
      for (let x of items[key]) {
        newPages.push(x);
      }
    }
    return newPages;
  },
  findNodeByName: (data, name) => {
    let response = null;
    let findNameItem = (tree) => {
      let result = null;
      if (tree.name === name) {
        return tree;
      }

      if (Array.isArray(tree.children) && tree.children.length > 0) {
        tree.children.some((node) => {
          result = findNameItem(node);
          return result;
        });
      }
      return result;
    };
    if (!data) return null;
    for (let item of data) {
      if (findNameItem(item)) {
        response = findNameItem(item);
        break;
      }
    }
    return response;
  },
  arrayMove: (array, oldIndex, newIndex) => {
    if (newIndex >= array.length) {
      var k = newIndex - array.length + 1;
      while (k--) {
        array.push(undefined);
      }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  },
  groupbyDDHHMM: (arr, name = "BookDate") => {
    const newArr = [];
    if (!arr) return false;
    arr.map((item) => {
      const dayFull = item[name];
      const d = dayFull.split("T")[0];
      var g = null;
      newArr.every((_g) => {
        if (_g.day == d) g = _g;
        return g == null;
      });
      if (g == null) {
        g = {
          day: d,
          dayFull: dayFull,
          items: [],
        };
        newArr.push(g);
      }
      g.items.push(item);
    });
    return newArr
      .map((item) => ({
        ...item,
        items: item.items.sort(function (left, right) {
          return moment.utc(right[name]).diff(moment.utc(left[name]));
        }),
      }))
      .sort(function (left, right) {
        return moment.utc(right.dayFull).diff(moment.utc(left.dayFull));
      });
  },
};
