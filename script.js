let addbtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let taskAreaCont = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");
let removeBtn = document.querySelector(".remove-btn");
let colors = ["lightpink","blue","green","black"];
let removemodal = false;
let addmodal = true;
let modalPriorityColor = colors[colors.length-1];
var uid = new ShortUniqueId();


let ticketArr = [];

if(localStorage.getItem("tickets")){
    let str = localStorage.getItem("tickets");
    let arr = JSON.parse(str);
    ticketArr = arr; 
    for(let i = 0;i<arr.length;i++){
        let  ticketObj = arr[i];
        createTicket(ticketObj.color,ticketObj.task,ticketObj.id);
    }
}
for(let i = 0; i< toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click",function(){
        let currentColor = toolBoxColors[i].classList[1];
        let filteredArr = [];
        for(let i = 0 ; i< ticketArr.length;i++){
            if(ticketArr[i].color == currentColor){
                filteredArr.push(ticketArr[i]);
            }
        }

        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let j = 0 ; j <allTickets.length;j++){
            allTickets[j].remove();
        }

        for(let  i = 0 ; i < filteredArr.length;i++){
            let ticket = filteredArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color,task,id);
        }

    })

    toolBoxColors[i].addEventListener("dblclick",function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for(let j = 0 ; j < allTickets.length;j++){
            allTickets[j].remove();
        }
        
        for(let  i = 0 ; i < ticketArr.length;i++){
            let ticket = ticketArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color,task,id);
        }
    })
    
}

addbtn.addEventListener("click",function(){
    if(addmodal){
     modalCont.style.display = "flex";
    }else{
    modalCont.style.display = "none";
}
addmodal = !addmodal;
})

for(let i = 0 ; i <allPriorityColors.length;i++){
    let priorityDivOnecolor = allPriorityColors[i];
    priorityDivOnecolor.addEventListener("click",function(){
        for(let j = 0;j < allPriorityColors.length;j++){
            allPriorityColors[j].classList.remove("active");
        }
        priorityDivOnecolor.classList.add("active");
        modalPriorityColor = priorityDivOnecolor.classList[0];
    })
}

modalCont.addEventListener("keydown",function(e){
    let key = e.key;
    if(key == 'Enter'){
        createTicket(modalPriorityColor,taskAreaCont.value);
        taskAreaCont.value = "";
        modalCont.style.display = "none";
        addmodal = !addmodal;
    }
})

removeBtn.addEventListener("click",function(){
    if(removemodal){
        removeBtn.style.color = "black";
    }
    else{
        removeBtn.style.color = "red";
    }
    removemodal = !removemodal;
})

function createTicket(ticketColor,task,ticketid){
    let id;
    if(ticketid == undefined){
        id = uid();
    }else{
        id = ticketid;
    }
    // <div class="ticket-cont">
            // <div class="ticket-color"></div>
            // <div class="ticketid">1234</div>
            // <div class="taskarea">hello world</div>
    //     </div>
   
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute('class','ticket-cont');
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                            <div class="ticketid">#${id}</div>
                            <div class="textarea">${task}</div>
                            <div class ="lock-unlock"><i class =" fa fa-lock"></i></div>`
    mainCont.appendChild(ticketCont);
    
    //lockUnlock handle
    let lockUnlockBtn = ticketCont.querySelector(".lock-unlock i");
    let ticketTextArea = ticketCont.querySelector(".textarea");
    lockUnlockBtn.addEventListener("click",function(){
        if(lockUnlockBtn.classList.contains("fa-lock")){
            lockUnlockBtn.classList.remove("fa-lock");
            lockUnlockBtn.classList.add("fa-unlock");
            ticketTextArea.setAttribute("contenteditable","true");
        }else{
            lockUnlockBtn.classList.remove("fa-unlock");
            lockUnlockBtn.classList.add("fa-lock");
            ticketTextArea.setAttribute("contenteditable","false");
        }
        //update text area of ticketarr
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].task = ticketTextArea.textContent;
        updateLocalStorage();
    })


    //handling remove
    ticketCont.addEventListener("click",function(){
        if(removemodal){
                    //delete from UI
                     ticketCont.remove();

                     //delete from ticketArr
                     let ticketIdx = getTicketIdx(id);
                     ticketArr.splice(ticketIdx,1)//remves 1 ticket at a time
                     updateLocalStorage();

        }
    })

    //handling color

    let ticketColorBand = ticketCont.querySelector(".ticket-color");
    ticketColorBand.addEventListener("click",function(){
        //update UI
        let currentTicketColor = ticketColorBand.classList[1];
        let currentTicketColorIdx = -1;
        for(let i = 0 ; i <colors.length;i++){
            if(currentTicketColor == colors[i]){
                currentTicketColorIdx = i;
                break;
            }
        }

        let nextColorIdx = (currentTicketColorIdx+1)%colors.length;
        let nextColor = colors[nextColorIdx];
        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(nextColor);

        //update ticketArr
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].color = nextColor;
        updateLocalStorage();
    })

    if(ticketid == undefined)
        ticketArr.push({"color": ticketColor,"task":task,"id":"#"+id})
       updateLocalStorage();
    
}

function getTicketIdx(id){
    for(let i = 0 ; i<ticketArr.length;i++){
        if(ticketArr[i].id == id){
            return  i;
        }
    }
}

function updateLocalStorage(){
    let stringifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets",stringifyArr);
}

