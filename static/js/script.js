const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const refreshbtn = document.querySelector(".refresh-btn");
var clicked=false;
let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

localStorage.setItem('botuser', 'Pranay');
let loggedusername=localStorage.getItem('botuser');
$(".loggedusername").text(loggedusername)

const generateResponse = (usermsg) => {
    if (usermsg.length > 0){
        let html_msg=`<li class="chat outgoing"><div class="u-question">${usermsg}</div>
                         <div style="color: grey;font-size:11px;padding-top: 10px;">${getCurrentDateTime()}</div>
                      </li>`;
        $(".chatbox").append(html_msg)
        let loader =`<li class="chat incoming"><span class="material-symbols-outlined">smart_toy</span>
                         <div class="bot-loader" style="border-radius:10px 10px 10px 10px;"></div>
                    </li>`
        $(".chatbox").append(loader)
        const API_URL = "/getanswer";
        const formData = new FormData();
        formData.append("question", usermsg);
        $.ajax({
            url: API_URL,
            type: "POST",
            data: formData,
            processData: false,  
            contentType: false  
        }).done(function(data) {
            console.log(data);
            const buttons = document.querySelectorAll('.chatbox .bot-btns');
            buttons.forEach(button => {
                if (!button.disabled) {
                    button.disabled = true;
                }
            });
            $('.incoming:last').remove();
            var res='';
            if (!data.message.startsWith("answer:")) {
                res = data.message.trim();
            } else {
                res=data.message.trim()
            }
            $(".chatbox").append(`<li class="chat incoming"><span class="material-symbols-outlined">smart_toy</span>
                                        <div>
                                            <div class="bot-response"></div>
                                            <div class="like-btn-parent" style="display:none">
                                                <div style="display: flex;gap: 15px;" id="svg-parent">
                                                <svg onclick="like()" class="like-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#FFD43B" d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg>
                                                <svg onclick="dislike()" style="transform: rotateY(180deg);" class="like-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#FFD43B" d="M313.4 479.1c26-5.2 42.9-30.5 37.7-56.5l-2.3-11.4c-5.3-26.7-15.1-52.1-28.8-75.2H464c26.5 0 48-21.5 48-48c0-18.5-10.5-34.6-25.9-42.6C497 236.6 504 223.1 504 208c0-23.4-16.8-42.9-38.9-47.1c4.4-7.3 6.9-15.8 6.9-24.9c0-21.3-13.9-39.4-33.1-45.6c.7-3.3 1.1-6.8 1.1-10.4c0-26.5-21.5-48-48-48H294.5c-19 0-37.5 5.6-53.3 16.1L202.7 73.8C176 91.6 160 121.6 160 153.7V192v48 24.9c0 29.2 13.3 56.7 36 75l7.4 5.9c26.5 21.2 44.6 51 51.2 84.2l2.3 11.4c5.2 26 30.5 42.9 56.5 37.7zM32 384H96c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H32C14.3 96 0 110.3 0 128V352c0 17.7 14.3 32 32 32z"/></svg>
                                                </div>
                                                <div id="res-alert" style="font-size: 12px;color: #ff555f;display:none;">
                                                    Response Saved...!
                                                </div>
                                            </div>
                                        </div>
                                    </li>`)
            res=convertUrlsToLinks(res)
            res=res.replace(/\n/g, "<br>")
            res=res.replace('<br><br>','<br>')
            typeWriter(res,typingSpeed = 10)
            
        }).fail(function() {
            // messageElement.classList.add("error");
            // messageElement.textContent = "Oops! Something went wrong. Please try again.";
        }).always(function() {
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
    }else{
        alert('Please enter a question...')
    }
}

const handleChat = () => {
    $('.like-btn-parent').remove();
    userMessage = chatInput.value.trim(); 
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(userMessage);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

const refreshchat = () => {
    $(".chatbox").html('')  
    console.log('refresh click');
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    let htmlstring=`<li class="chat incoming"><span class="material-symbols-outlined">smart_toy</span>
                        <div class="bot-response ">
                        <div>Hello <span class="loggedusername">${loggedusername}</span> , Welcome to Access Robo.What brings you here today?
                            Please use the options below or ask me anything about product.</div>
                            <br>
                            <br>
                            <p style="font-weight: 600;">(Do not share any personally identificable information(pii) or sensitive personal information(spi) data as chat history is logged.)</p>
                        </div>
                </li> 
                <li class="chat incoming" style="padding-top: 10px;">
                    <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                    <div class="bot-response">
                    <div>Here are some questions i can help you with.</div>
                    <button class="bot-btns" onclick="botbtns(this)">Here are some questions i can help you with, Here  i can help you with?</button>
                    <button class="bot-btns" onclick="botbtns(this)" style="margin: 5px 0px;"> i can help you with?</button>
                    <button class="bot-btns" onclick="botbtns(this)">Here are some questions i can help you with?</button>
                    
                    </div>
                </li>
                <li class="chat incoming" style="padding-top: 10px;height: 15px;">
                    <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                    <div style="color: grey;font-size: 11px;">${getCurrentDateTime()}</div>
                </li>  `
  $(".chatbox").html(htmlstring)
}

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => {   document.body.classList.toggle("show-chatbot")});
refreshbtn.addEventListener("click", refreshchat);



function botbtns(ele){
    const buttonText = ele.innerText.trim();
    $('.like-btn-parent').remove();    
    generateResponse(buttonText);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    const buttons = document.querySelectorAll('.chatbox .bot-btns');
    buttons.forEach(button => { button.disabled = true });
    var helpBtns = document.getElementById('helpbtns');
        helpBtns.style.display = 'none';
}

function modaloff(){
    var modal = document.getElementById('helpbtns');
            modal.style.display = 'none';

    
}

function raiseticket(ele){
    const buttonText = ele.innerText.trim();
    $('.like-btn-parent').remove();   
     
    const buttons = document.querySelectorAll('.chatbox .bot-btns');
    buttons.forEach(button => { button.disabled = true });
    var helpBtns = document.getElementById('helpbtns');
    helpBtns.style.display = 'none';
    let html_msg=`<li class="chat outgoing"><div class="u-question">${buttonText}</div>
                         <div style="color: grey;font-size:11px;padding-top: 10px;">${getCurrentDateTime()}</div>
                      </li>`;
    $(".chatbox").append(html_msg)
    chatbox.scrollTo(0, chatbox.scrollHeight);
    let botuserValue = localStorage.getItem('botuser');
    console.log('botuserValue',botuserValue);
    let htmlstring=`<li class="chat incoming"><span class="material-symbols-outlined">smart_toy</span>
                        <div class="bot-response ">
                            <div style="font-weight: 500;margin-bottom:5px;">Raise Ticket Form</div>
                            <div id="formdiv">
                                <form  id="" action="" method="POST" class="ticketform">
                                    <div class=" mb-1">
                                        <label class="form-label mb-0" >Category</label>
                                        <select class="form-select cust-category" id="" name="Category" onchange="changeform(this)" required>
                                            <option value="Data Related Request">Data Related Request</option>
                                            <option value="Access Related request">Access Related request</option>
                                        </select>
                                    </div>
                                    <p style="margin: 0px;font-size: small;"><span style="color:red;background: transparent;margin: 0px;">* </span>Indicates required</p>
                                    <div class="mb-3">
                                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Request For</label>
                                        <select class="form-select cust-userid" name="Request For" required>
                                        <option selected value="${botuserValue}">${botuserValue}</option>
                                        </select>
                                    </div>
                                    <div>
                                       <div>
                                            <div class="mb-3">
                                                <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Request</label>
                                                <select class="typeofrequest1" onchange="typeofrequest1(this)" name="Type of Request" required>
                                                    <option value="--None--">--None--</option>
                                                    <option value="Data Modification or Backend Changes">Data Modification or Backend Changes</option>
                                                    <option value="Data Upload">Data Upload</option>
                                                    <option value="Request for Report or Data Dump">Request for Report or Data Dump</option>
                                                </select>
                                            </div>
                                       </div>
                                       <div class="aftertypeofrequest">
                                       
                                       </div>
                                    </div>
                                    <div class="mb-3">
                                        <label  class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Business Justification for the Request</label>
                                        <textarea class="form-control" id="" rows="2" name="Business Justification for the Reques" required autocomplete="off"></textarea>
                                    </div>
                                    <div class="mb-3">
                                        <label  class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Brief Description of the Request</label>
                                        <input type="text" class="form-control" id="" name="Brief Description of the Request" required autocomplete="off">
                                    </div>
                                    <div class="mb-3">
                                        <label  class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Any additional details</label>
                                        <textarea class="form-control" id="" rows="2" name="Any additional details" required autocomplete="off"></textarea>
                                    </div>
                                    <div style="display: flex;justify-content: space-between;align-items: center;" class="submit-btns">
                                        <div>
                                        <input class="btn btn-secondary"  type="reset" value="Reset" onclick="resetform()">
                                        <input  class="btn btn-primary" type="button" value="Submit" id="submit-ticket" onclick="submitfun()">
                                        </div>
                                        <div style="color:red;font-weight: 500;" class="formerror"></div> 
                                    </div>
                                </form>
                            </div>
                    </li> 
                    <li class="chat incoming" style="margin-top: 10px;height: 15px;">
                        <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                        <div style="color: grey;font-size: 11px;">${getCurrentDateTime()}</div>
                    </li>  `
    $(".chatbox").append(htmlstring)
    $(".cust-category").last().select2()
    $(".cust-userid").last().select2({
        disabled: true
    })
    $(".typeofrequest1").last().select2() //
}



function submitfun(){
    let ohr =$('#emp_ohr').val()
    let email =$('#emp_email').val()
    let dataaccess=$('#data-access').val()
    let securitytype =$('#security-type').val()
    if(ohr != '' && email != '' && dataaccess != '' && securitytype != ''){
        const formdata = new FormData();
        formdata.append("ohr", $('#emp_ohr').val());
        formdata.append("email", $('#emp_email').val());
        formdata.append("dataaccess", $('#data-access').val());
        formdata.append("securitytype", $('#security-type').val());
        $.ajax({
            type: 'POST',
            url: '/submitticket',
            data: formdata,
            processData: false, 
            contentType: false, 
            success: function(res) {
            console.log(res);
            if(res.msg="success"){
                $("#formerror").hide()
                $(".chatbox").append(`<li class="chat incoming" style="padding-top: 10px;">
                                        <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                                        <div class="bot-response" style="background-color: powderblue;">
                                        <div>Your ticket has been successfully submitted !!!<br><br>
                                        <strong>ID : RMTI80978355</strong>
                                        </div>
                                        </div>
                                    </li>
                                    <li class="chat incoming" style="padding-top: 10px;height: 15px;">
                                        <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                                        <div style="color: grey;font-size: 11px;">${getCurrentDateTime()}</div>
                                    </li>`)
                $('.ticketform').last().css({'pointer-events':'none'});

            }else{
                $("#formerror").show()
            }
                
            },
            error: function(error) {
                
            }
        });
    }
}

let calndercount=0;
function getcalender(ele){
    $('.like-btn-parent').remove();
    const buttonText = ele.innerText.trim();
    const buttons = document.querySelectorAll('.chatbox .bot-btns');
    buttons.forEach(button => { button.disabled = true });
    var helpBtns = document.getElementById('helpbtns');
    helpBtns.style.display = 'none';
    let html_msg=`<li class="chat outgoing"><div class="u-question">${buttonText}</div>
                         <div style="color: grey;font-size:11px;padding-top: 10px;">${getCurrentDateTime()}</div>
                      </li>`;
    $(".chatbox").append(html_msg)
    chatbox.scrollTo(0, chatbox.scrollHeight);
    let loader =`<li class="chat incoming"><span class="material-symbols-outlined">smart_toy</span>
                         <div class="bot-loader" style="border-radius:10px 10px 10px 10px;"></div>
                    </li>`
    $(".chatbox").append(loader)
    chatbox.scrollTo(0, chatbox.scrollHeight);
    $.ajax({
        url: '/getdashboard',
        type: "GET",
        processData: false,  
        contentType: false,
        success:function (data){
         console.log(data);
         if(data.msg=='success'){
            $('.incoming:last').remove();
            let htmlstring=`<li class="chat incoming"><span class="material-symbols-outlined">smart_toy</span>
                        <div class="bot-response ">
                            <div style="margin:5px 0px;">Current dashboard status...</div>
                            <div class="cal-container" id='count${calndercount}'>
                                <div class="cal-calendar">
                                <header>
                                    <pre class="cal-left">◀</pre>
                                    <div class="header-display">
                                    <p class="cal-display">""</p>
                                    </div>
                                    <pre class="cal-right">▶</pre>
                                </header>
                                <div class="cal-week">
                                    <div>Su</div>
                                    <div>Mo</div>
                                    <div>Tu</div>
                                    <div>We</div>
                                    <div>Th</div>
                                    <div>Fr</div>
                                    <div>Sa</div>
                                </div>
                                <div class="cal-days"></div>
                                </div>
                                <div class="cal-tooltip"></div>
                            </div>
                        </div>
                </li> 
                <li class="chat incoming" style="padding-top: 10px;height: 15px;">
                    <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                    <div style="color: grey;font-size: 11px;">${getCurrentDateTime()}</div>
                </li>  `
             $(".chatbox").append(htmlstring)
             let id="#count"+calndercount
             let parent = document.querySelector(id);
             let display = parent.querySelector(".cal-display");
             let days = parent.querySelector(".cal-days");
             let previous = parent.querySelector(".cal-left");
             let next = parent.querySelector(".cal-right ");
             let tooltip = parent.querySelector(".cal-tooltip");
         
                 let date = new Date();
                 let year = date.getFullYear();
                 let month = date.getMonth();
         
             function displayCalendar() {
                 const firstDay = new Date(year, month, 1);
                 const lastDay = new Date(year, month + 1, 0);
                 const firstDayIndex = firstDay.getDay();
                 const numberOfDays = lastDay.getDate();
                 let formattedDate = date.toLocaleString("en-US", { month: "long",year: "numeric" });
                 display.innerHTML = `${formattedDate}`;
                 days.innerHTML = ""; 
         
                 for (let x = 1; x <= firstDayIndex; x++) {
                     const div = document.createElement("div");
                     div.innerHTML = "";
                     days.appendChild(div);
                 }
         
                 for (let i = 1; i <= numberOfDays; i++) {
                     let div = document.createElement("div");
                     let currentDate = new Date(year, month, i);
                     let year2 = currentDate.getFullYear();
                     let month2 = String(currentDate.getMonth() + 1).padStart(2, '0');
                     let day2 = String(currentDate.getDate()).padStart(2, '0');
                     let customdate =`${year2}-${month2}-${day2}`;
                     div.dataset.date = customdate;
                     if(data.tdata.hasOwnProperty(customdate)){
                         div.classList.add("sdate");
                     }
                     let decision=isDateLessThanToday(customdate)   //getCurrentQuarterInfo(customdate)
                     if( decision ){
                         div.style.opacity = "0.5";
                     }
                     div.innerHTML = i;
                     days.appendChild(div);
         
                     if (
                         currentDate.getFullYear() === new Date().getFullYear() &&
                         currentDate.getMonth() === new Date().getMonth() &&
                         currentDate.getDate() === new Date().getDate()
                     ) {
                         div.classList.add("current-date");
                     }
                     div.addEventListener("mouseover", (e) => {
                         let eventDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
                         let eventList =data.tdata[eventDate] //events[eventDate];
                         if (eventList) {
                             // tooltip.innerHTML =eventList.join("<br>");
                             tooltip.innerHTML = eventList.map((event, index) => `${(index + 1).toString().padStart(2, '0')}) ${event}`).join("<br>");
                             tooltip.style.display = "block";
                             //tooltip.style.left = `${e.pageX + 10}px`;
                             //tooltip.style.right ='0px' //`${e.pageX + 10}px`;
                            //  tooltip.style.top = `${e.pageY}px`;
                            //console.log('e.pageY',e.pageY- 400); 
                           // console.log('e.pageX',e.pageX);
                            tooltip.style.bottom=`${e.pageY -325 }px`; 
                         } else {
                             tooltip.style.display = "none";
                         }
                     });
         
                     div.addEventListener("mouseout", () => {
                         tooltip.style.display = "none";
                     });
                 }
             }
         
             displayCalendar();
         
             previous.addEventListener("click", () => {
                 month--;
                 if (month < 0) {
                     month = 11;
                     year--;
                 }
                 date.setMonth(month);
                 displayCalendar();
             });
         
             next.addEventListener("click", () => {
                 month++;
                 if (month > 11) {
                     month = 0;
                     year++;
                 }
                 date.setMonth(month);
                 displayCalendar();
             });
         
             calndercount++
            // chatbox.scrollTo(0, chatbox.scrollHeight);
         }
        },error:function (error){
            console.log(error);
        }
    })
}


function isDateLessThanToday(dateString) {
    const providedDate = new Date(dateString);
    const today = new Date();
    if(today > providedDate){
        return true
    }

}


function resetform(){
    const forms = document.getElementsByClassName('ticketform');
    const lastForm = forms[forms.length - 1];

    if (lastForm) {
        // Reset the form
        lastForm.reset();
        // Reset each Select2 element within the form to their default state
        $(lastForm).find('.select2-hidden-accessible').val(null).trigger('change');
        $('.cust-category').last().val("Data Related Request").trigger("change")
        let botuserValue = localStorage.getItem('botuser');
        $(".cust-userid").last().val(botuserValue).trigger("change")
    }
}

function submitfun(){
    let forms = document.querySelectorAll('.ticketform');
    let lastForm = forms[forms.length - 1];
    const formdata = new FormData();
    let fdata = {};
    for (let element of lastForm.elements) {
        if (element.name) { 
            fdata[element.name] = element.value.trim();
            formdata.append(element.name, element.value.trim());
        }
    }
    let notempty=true;
    let emptykey=''
    for (const [key, value] of Object.entries(fdata)) {
        if (!value || value === '') {
            emptykey=key
            notempty=false
            break;
        }
    }
   console.log(fdata);
    if(notempty){
        $.ajax({
            type: 'POST',
            url: '/submitticket',
            data: formdata,
            processData: false, 
            contentType: false, 
            success: function(res) {
            console.log(res);
            if(res.msg="success"){
                $(".formerror").last().text('')
                let htmlstr=`<li class="chat incoming" style="padding-top: 10px;">
                                <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                                <div class="bot-response" style="background-color: powderblue;">
                                    <div>Your ticket has been successfully submitted !!!<br><br>`
                                htmlstr+=`<strong>ID</strong> : <span> 12345678</span><br>`
                                let listkeys=Object.keys(res.tdata)
                                for(let i=0;i<listkeys.length;i++){
                                    htmlstr+=`<strong>${listkeys[i]}</strong> : <span>${res.tdata[listkeys[i]]}</span><br>`
                                }
                htmlstr+=`          </div>
                                </div>
                            </li>
                            <li class="chat incoming" style="padding-top: 10px;height: 15px;">
                                <span class="material-symbols-outlined" style="color: transparent;background-color: transparent;">smart_toy</span>
                                <div style="color: grey;font-size: 11px;">${getCurrentDateTime()}</div>
                            </li>`
                $(".chatbox").append(htmlstr)
                $('.ticketform').last().find('input, select, textarea').prop('readonly', true);
                $('.ticketform').last().find('select').prop('disabled', true);
                $('.submit-btns').last().css({'pointer-events':'none'});

            }else{
                $(".formerror").last().text('Internal server Error !!!')
            }   
            },
            error: function(error) {
                $(".formerror").last().text('Internal server Error !!!')
            }
        });
    }else{
        // alert(`The field "${emptykey}" is required.`);
        $(".formerror").last().text('All fields are required !!!')
    }
}