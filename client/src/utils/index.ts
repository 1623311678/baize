//utils
import moment from 'moment';

const formatTimeStr = (value,format='YYYY-MM-DD HH:mm:ss')=> {
    return moment(value).format(format)
}
export {
    formatTimeStr
}