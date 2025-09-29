function addToCal(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var cell = ss.getActiveCell();
  var R = cell.getRow();

  //grab values for current row to pass to calendar event
  var date_of_event = ss.getRange('G'+R).getValue();
  var date = new Date(date_of_event);
  var event_title = ss.getRange('A'+R).getValue();
  //access the calendar
  var cal = CalendarApp.getCalendarById('[IDREMOVED]');
  cal.createAllDayEvent(event_title,date);

  ss.toast("Event added to " + cal.getName());
}

function getCalendar(){
  var calendarName = "Seances"
  var debutJanvier = new Date(2022,0,1,1,1,1)
  var finDecembre = new Date(2022,11,31,1,1,1)
  
  var calendar = CalendarApp.getCalendarsByName(calendarName)[0]
  var events = calendar.getEvents(debutJanvier, finDecembre)
  
  Logger.log("get calendar named "+calendar.getName()+" from "+debutJanvier+" to "+finDecembre+" :")
  for(var i = 0; i < events.length; i++){
    Logger.log(events[i].getId())
  }
}

function create_calendar() {
var ss = SpreadsheetApp.getActiveSpreadsheet();
var sheet = ss.getSheetByName("seances");
var index = 2;
var lastRow = sheet.getLastRow();

for (;index <= lastRow; index++){
  var type = sheet.getRange(index, 1, 1, 1).getValue();
  var taskTitle = sheet.getRange(index, 2, 1, 1).getValue();
  var taskDesc = sheet.getRange(index, 3, 1, 1).getValue();
  var onCalendar = sheet.getRange(index, 4, 1, 1).getValue();
  var originalEstimate = sheet.getRange(index, 5, 1, 1).getValue();
  var loggedEffort = sheet.getRange(index, 6, 1, 1).getValue();
  var startDate = sheet.getRange(index, 7, 1, 1).getValue();
  var endDate = sheet.getRange(index, 8, 1, 1).getValue();
  var status = sheet.getRange(index, 9, 1, 1).getValue();
  
  //var sendInvites = true;
  
  /*Date format should be set correctly in both the sheet and the editor.*/
  
  /* How to format the date 
  startDate_proper = new Date(startDate);
  startDate_proper = Utilities.formatDate(startDate_proper, "GMT+0530", "dd-MM-yyyy HH:mm:ss");
  
  endDate_proper = new Date(endDate);
  endDate_proper = Utilities.formatDate(endDate_proper, "GMT+0530", "dd-MM-yyyy HH:mm:ss");
  
  */    
  //Browser.msgBox(type+':'+taskTitle+':'+startDate+':'+onCalendar, Browser.Buttons.OK_CANCEL);
  
  if (onCalendar == 'Yes' && startDate && endDate && status != 'Done'){
    //  Browser.msgBox(type+':'+taskTitle+':'+startDate+':'+onCalendar, Browser.Buttons.OK_CANCEL);
    //  Browser.msgBox(Utilities.formatDate(temp, "GMT+0530", "dd-MM-yyyy HH:mm:ss"), Browser.Buttons.OK_CANCEL);
    //  Browser.msgBox(startDate+':'+endDate+':'+CalendarApp.getCalendarsByName("sparxsys_tasks")[0].getEvents(startDate, endDate));
    
    var events =  CalendarApp.getCalendarsByName("sparxsys_tasks")[0].getEvents(startDate, endDate);
    delete_events(events);
    var calendar = CalendarApp.getCalendarsByName("sparxsys_tasks")[0].createEvent(taskTitle, startDate,endDate,{description: taskDesc});
    
    // var calendar = CalendarApp.getCalendarById("sparxsys_task").createEvent(taskTitle, startDate,endDate,{description: taskDesc});
    
  }
  
  // var calendar = CalendarApp.getCalendarById("ravisagar@gmail.com").createEvent(taskTitle, startDate_proper,endDate_proper,{description: taskDesc}); 
  // var calendar = CalendarApp.getCalendarById("ravisagar@gmail.com").createEvent(taskTitle, Utilities.formatDate(startDate_proper, "GMT+0530", "dd-MM-yyyy HH:mm:ss"),Utilities.formatDate(endDate_proper, "GMT+0530", "dd-MM-yyyy HH:mm:ss"),{description: taskDesc});
  
  
}// End of for Loop
  
  
  
}// End of CalendarTest Function



function delete_events(events) {
  
  for(var i=0; i<events.length;i++){
      var ev = events[i];
    
   // Browser.msgBox(ev.getTitle());
//      Logger.log(ev.getTitle()); // show event name in log
      ev.deleteEvent();
    }
  
}




function sheet2calendar() {
  var spreadsheet = SpreadsheetApp.getActive().getSheetByName('Seances');
  var seances = spreadsheet.getDataRange().getValues();

  var calendar = CalendarApp.getCalendarsByName('Seances')[0]   
  
  
  for (var x = 1; x < seances.length; x++){
    // retrieve one entry at a time 
    var entry = seances[x];

    // get start time from the 1st column, column 0
    var date = new Date(entry[1])
    var heure = new Date(entry[2])

    var year = date.getFullYear()
    var month = date.getMonth()
    var day = date.getDate()
    var hour = heure.getHours()
    var minute = heure.getMinutes()

    // Compute end time by adding 3 hours to the start time
    var eventLength = 0.75; // in hours
    var startTime = new Date(year,month,day,hour,minute)
    var endTime = new Date(startTime.getTime() + eventLength*60*60*1000)

    // retrieve movie title
    var titre = entry[4];
    if (titre == ''){continue;}
    var description = entry[3];
    // get events during the start and end times
    // specified above
    var conflicts = calendar.getEvents(startTime, endTime);

    //  if the length of conflicts is 0, create an event directly
    if (conflicts.length == 0){
      createAndShare(calendar, titre, startTime, endTime, description);
    } 
    // if the length of conflict is larger than 0
    // iterate thorugh the conflicting events
    else {
      for (var c = 0; c < conflicts.length; c++){
        // load one conflict at a time
        var conflict = conflicts[c]

        // if title of conflict matches movie title
        // skip this conflicting event
        if (conflict.getTitle() == titre && conflict.getDescription() == description){continue;}

        // delete old event if the previous if
        // statement was not enteredx 
        conflict.deleteEvent();   

        // create new event 
        createAndShare(calendar, titre, startTime, endTime, description);

      }
    }
  }  
}
  
function createAndShare(cal, title, start, end, description){
  // create event with provided title, start
  // start and end time
  var event = cal.createEvent(title, start, end,).setDescription(description);
}




