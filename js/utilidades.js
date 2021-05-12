function guardar_calendario(){

    if ($("#getEvents").val().length < 1) {
      alert("Por favor agende al menos un usuario")
      return false
    }
    let data = JSON.parse($("#getEvents").val())
    let getEvents = []
    for (let i = 0; i < data.length; i++) {
      getEvents.push({idus: data[i].id ,fecha: data[i].start})
    }
    let value ="["+JSON.stringify(getEvents)+"]"
    let values = JSON.parse(JSON.stringify(getEvents))

    console.log(JSON.stringify(values))

  $.ajax({
    type:'post',
    url:'http://test.movilbox.co:888/test_mbox/test.php?metodo=guardar',
    data: values,
    beforeSend:function(){
      $('#loader').show();
    },
    complete:function(){
      $('#loader').hide();
    },
    success:function(result){
      try{
          if(result.state == 1){
          alert(result.msg);
          
        }else if(result.state == 0){
          alert(result.msg);
        }
      }catch(e){
        alert("Error, catch"+e.message); 
      }
    
    }
  });

}

function iniciarUsuarios() {
  var containerEl = document.getElementById('external-events-list');
    new FullCalendar.Draggable(containerEl, {
      itemSelector: '.fc-event',
      eventData: function(eventEl) {
        console.log(JSON.stringify(eventEl))
        return {
          id: eventEl.id,
          title: eventEl.innerText.trim(),
          color: '#1'+eventEl.id
        }
      },
    });
}

function iniciarCalendario() {
  /* initialize the calendar
    -----------------------------------------------------------------*/
    var usersWait = []
    var calendarEl = document.getElementById('calendar');
    var inicioPeriodo = '' 
    var periodos = []
    $.ajax({
      type:'get',
      url:'http://test.movilbox.co:888/test_mbox/test.php?metodo=periodos',
      dataType: 'json',
      data:{},
      beforeSend:function(){
        
      },
      complete:function(){
        
      },
      success:function(result){
        //alert(JSON.stringify(result))
        try {
          periodos = result
          inicioPeriodo = Date.parse(periodos[0].anio+"-"+periodos[0].mes+"-01")
        } catch (error) {
          alert("Ha ocurrido un error: "+error)
        }

        var calendar = new FullCalendar.Calendar(calendarEl, {
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
          },
          locale: 'es',
          initialDate: inicioPeriodo,
          editable: true,
          dayMaxEvents: true, // allow "more" link when too many events
          droppable: true, // this allows things to be dropped onto the calendar
          eventRender: function (event, element, view) {
            if (event.color) {
                element.css('background-color', event.color)
            }
          },
          eventClick: function(arg) {
            $("#btn-modal").click()
          },
          eventReceive: function(info) {
            if (usersWait.length < 1) {
              usersWait = calendar.getEvents()
              $("#getEvents").val(JSON.stringify(usersWait))
              return false
            }
            let add = 0;
              for (let i = 0; i < usersWait.length; i++) {
                let start = usersWait[i].start.toString() 
                let start0 = start.substring(0, 15) 
                let start1 = info.event._instance.range.end.toString() 
                let start2 = start1.substring(0, 15) 
                if ($.trim(usersWait[i].id) == $.trim(info.event._def.publicId) 
                && start0 == start2 ) {
                  alert("El usuario  ya se encuentra programado para el día seleccionado.")
                  info.revert();
                  add = 0
                  return false
                }else{
                  add = 1
                }
              }
              if (add == 1) {
                usersWait = calendar.getEvents()
                $("#getEvents").val(JSON.stringify(usersWait))
              }
          },
          eventDrop: function(info) {
            if (usersWait.length < 1) {
              usersWait = calendar.getEvents()
              $("#getEvents").val(JSON.stringify(usersWait))
              return false
            }
            let add = 0;
              for (let i = 0; i < usersWait.length; i++) {
                let start = usersWait[i].start.toString() 
                let start0 = start.substring(0, 15) 
                let start1 = info.event._instance.range.end.toString() 
                let start2 = start1.substring(0, 15) 
                if ($.trim(usersWait[i].id) == $.trim(info.event._def.publicId) 
                && start0 == start2 ) {
                  alert("El usuario  ya se encuentra programado para el día seleccionado.")
                  info.revert();
                  add = 0
                  return false
                }else{
                  
                  add = 1
                }
              }
              if (add == 1) {
                usersWait = calendar.getEvents()
                $("#getEvents").val(JSON.stringify(usersWait))
              }
            }
            
        });
        
        calendar.render();
      }
    });
  
}