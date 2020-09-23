import statusFilterJson from '@/data/statusFilter.json'
function filterObj(type, value) {
  const newVal = statusFilterJson[type][value] ? statusFilterJson[type][value]['name'] ? statusFilterJson[type][value]['name'] : value : value
  const color = statusFilterJson[type][value] ? statusFilterJson[type][value]['color'] ? statusFilterJson[type][value]['color'] : '#409EFF' : '#409EFF'
  return {
    text: newVal,
    type: color
  }
}
const statusFilterQuery = {
  methods: {
    statusFilterQuery(type) {
      const resault = Object.entries(statusFilterJson[type]);
      const queryArr = [];
      for (const [key, value] of resault) {
        queryArr.push({
          value: key,
          label: value.name
        })
      }
      return queryArr
    }
  }
}
const filterColor = {
  methods: {
    filterColor(value, type) {
      const obj = filterObj(type, value)
      const color_ = obj.type ? obj.type : '#409EFF';
      return color_
    }
  }
}
const statusFilter = {
  methods: {
    statusFilter(data, filterName) {
      const obj = filterObj(filterName, data);
      let color_ = 'primary';
      if (obj.type == '#409EFF') { // blue
        color_ = 'primary';
      } else if (obj.type == '#67C23A') { // green
        color_ = 'success';
      } else if (obj.type == '#E6A23C') { // yellow
        color_ = 'warning';
      } else if (obj.type == '#F56C6C') { // red
        color_ = 'danger';
      } else if (obj.type == '#909399') { // gray
        color_ = 'info';
      }
      const promise = {
        text: obj.text,
        type: color_,
        color: obj.type
        // color: obj.type ? obj.type : "#409EFF"
      }
      return promise
    }
  }
}

export { filterColor, statusFilterQuery, statusFilter }
