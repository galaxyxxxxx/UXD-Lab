function weekFormat(week) {
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

function monthFormat(month) {
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

function dateFormat(date) {
  let week = date.getDay()
  let day = date.getDate()
  let month = date.getMonth()+1
  let year = date.getFullYear()
  let weekFormat = this.weekFormat(week)
  let monthFormat = this.monthFormat(month)
  // console.log("utils", weekFormat + ', ' + day + ' ' + monthFormat + ' ' + year)
  return weekFormat + ',  ' + day + ' ' + monthFormat + ' ' + year
}

module.exports = {
  dateFormat : dateFormat,
  weekFormat : weekFormat,
  monthFormat : monthFormat
}