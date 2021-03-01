function weekFormatEN(week) {
  switch (week) {
    case 0: return 'Sunday'; break;
    case 1: return 'Monday'; break;
    case 2: return 'Tuesday'; break;
    case 3: return 'Wednesday'; break;
    case 4: return 'Thursday'; break;
    case 5: return 'Friday'; break;
    case 6: return 'Saturday'; break;
    default: break;
  }
}
function monthFormatEN(month) {
  switch (month) {
    case 1: return 'Jan'; break;
    case 2: return 'Feb'; break;
    case 3: return 'Mar'; break;
    case 4: return 'Apr'; break;
    case 5: return 'May'; break;
    case 6: return 'Jun'; break;
    case 7: return 'Jul'; break;
    case 8: return 'Aug'; break;
    case 9: return 'Sept'; break;
    case 10: return 'Oct'; break;
    case 11: return 'Nov'; break;
    case 12: return 'Dec'; break;
    default: break;
  }
}
function dateFormatEN(date) {
  let week = date.getDay()
  let day = date.getDate()
  let month = date.getMonth()+1
  let year = date.getFullYear()
  let weekFormat = this.weekFormatEN(week)
  let monthFormat = this.monthFormatEN(month)
  return weekFormat + ',  ' + day + ' ' + monthFormat + ' ' + year
}

function weekFormatCN(week) {
  return '周' + '日一二三四五六'.charAt(week)
}
function monthFormatCN(month) {
  return month
}
function dateFormat(date) {
  let week = date.getDay()
  let day = date.getDate()
  let month = date.getMonth()+1
  let year = date.getFullYear()
  let weekFormat = this.weekFormatCN(week)
  let monthFormat = this.monthFormatCN(month)
  return weekFormat + ',  ' +  monthFormat + '月' + day + '日'
}

module.exports = {
  dateFormat : dateFormat,
  weekFormatCN : weekFormatCN,
  monthFormatCN : monthFormatCN
}