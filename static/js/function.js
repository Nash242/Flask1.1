function changeform(element){
    let value=element.value
    console.log(value);
    if(value == "Data Related Request"){
        $(".aftertypeofrequest").last().html('')   //  $('.typeofrequest1').last().val(null).trigger('change'); 
        $('.typeofrequest1').last().select2('destroy')
        $('.typeofrequest1').last().attr('onchange', 'typeofrequest1(this)').html('');
        let optionstr=`<option value="--None--">--None--</option>
                        <option value="Data Modification or Backend Changes">Data Modification or Backend Changes</option>
                        <option value="Data Upload">Data Upload</option>
                        <option value="Request for Report or Data Dump">Request for Report or Data Dump</option>`
        $('.typeofrequest1').last().append(optionstr)
        $('.typeofrequest1').last().select2()
    }else{
        $(".aftertypeofrequest").last().html('')   // $('.typeofrequest1').last().val(null).trigger('change');
        $('.typeofrequest1').last().select2('destroy')
        $('.typeofrequest1').last().attr('onchange', 'typeofrequest2(this)').html('');
        let optionstr=`<option value="--None--">--None--</option>
                       <option value="Data Purge and Archival">Data Purge and Archival</option>
                       <option value="BPM">BPM</option>`
        $('.typeofrequest1').last().append(optionstr)
        $('.typeofrequest1').last().select2()
    }
}

function removenextsibling(selectElement){
    const parentElement = selectElement.parentElement;
    let nextSibling = parentElement.nextElementSibling;
    while (nextSibling) {
        const toRemove = nextSibling;
        nextSibling = nextSibling.nextElementSibling;
        toRemove.remove();
    }
}

function typeofrequest1(element){
    let value=element.value
    console.log(value); 
    if (value == '--None--'){
        $(".aftertypeofrequest").last().html('')
    }else if(value == 'Data Modification or Backend Changes'){
        $(".aftertypeofrequest").last().html('')
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Application</label>
                        <select class="dmobchnages1" onchange="dmobchnages1(this)" style="width="100%" required name="Application">
                            <option value="--None--">--None--</option>
                            <option value="Bank of America">Bank of America</option>
                            <option value="Chatbot HR PHP">Chatbot HR PHP</option>
                            <option value="Amber">Amber</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".dmobchnages1").last().select2()
    }else if(value == 'Data Upload'){
        $(".aftertypeofrequest").last().html('')
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Application</label>
                        <select class="du1" onchange="du1(this)" style="width="100%" required name="Application">
                            <option value="--None--">--None--</option>
                            <option value="Asset Governance Tool-GE">Asset Governance Tool-GE</option>
                            <option value="Autorecon">Autorecon</option>
                            <option value="Ariba">Ariba</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".du1").last().select2()
    }
}

//flow 1  1)Data Modification or Backend Changes
function dmobchnages1(element){
    let value=element.value
    console.log(value);
    if (value == '--None--'){
        removenextsibling(element)
    }else if(value == 'Bank of America'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="boa1" onchange="boa1(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Ticket Creation">Ticket Creation</option>
                            <option value="Qonversation Q&A">Qonversation Q&A</option>
                            <option value="Transactional Q&A">Transactional Q&A</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr) 
        $(".boa1").last().select2()
    }
    else if(value == 'Chatbot HR PHP'){
       removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="chrphp1" onchange="chrphp1(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Qonversation Q&A">Qonversation Q&A</option>
                            <option value="Transactional Q&A">Transactional Q&A</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)  //
        $(".chrphp1").last().select2()
    }
}
//flow 1.1
function boa1(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
        removenextsibling(element)
    }else if(value == 'Ticket Creation'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}
//flow 1.2
function chrphp1(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
       removenextsibling(element)
    }else if(value == 'Qonversation Q&A'){
       removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}

//flow 2 //Data Upload
function du1(element){
    let value=element.value
    console.log(value);
      
    if (value == '--None--'){
       removenextsibling(element)
    }else if(value == 'Asset Governance Tool-GE'){
       removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="agt1" onchange="agt1(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Transactional Q&A">Transactional Q&A</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)  
        $(".agt1").last().select2()
    }else if(value == 'Autorecon'){
       removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="Autorecon1" onchange="Autorecon1(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Transactional Q&A">Transactional Q&A</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)  //
        $(".Autorecon1").last().select2()
    }
}

//flow 2.1 
function agt1(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
       removenextsibling(element)
    }else if(value == 'Transactional Q&A'){
       removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}

//flow 2.2
function Autorecon1(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
      removenextsibling(element)
    }else if(value == 'Connect to Agent'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}


//access related stuff
function typeofrequest2(element){
    let value=element.value
    console.log(value); 
    if (value == '--None--'){
        $(".aftertypeofrequest").last().html('')
    }else if(value == 'Data Purge and Archival'){
        $(".aftertypeofrequest").last().html('')
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Application</label>
                        <select class="dpaa1" onchange="dpaa1(this)" style="width="100%" required name="Application">
                            <option value="--None--">--None--</option>
                            <option value="Bank of America">Bank of America</option>
                            <option value="Chatbot HR PHP">Chatbot HR PHP</option>
                            <option value="Amber">Amber</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".dpaa1").last().select2()
    }else if(value == 'BPM'){
        $(".aftertypeofrequest").last().html('')
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Application</label>
                        <select class="bpm1" onchange="bpm1(this)" style="width="100%" required name="Application">
                            <option value="--None--">--None--</option>
                            <option value="Asset Governance Tool-GE">Asset Governance Tool-GE</option>
                            <option value="Autorecon">Autorecon</option>
                            <option value="Ariba">Ariba</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".bpm1").last().select2()
    }
}
//flow 3 //Data Purge and Archival

function dpaa1(element){
    let value=element.value
    console.log(value);
    if (value == '--None--'){
       removenextsibling(element)
    }else if(value == 'Bank of America'){
      removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="boa2" onchange="boa2(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Ticket Creation">Ticket Creation</option>
                            <option value="Qonversation Q&A">Qonversation Q&A</option>
                            <option value="Transactional Q&A">Transactional Q&A</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr) 
        $(".boa2").last().select2()
    }
    else if(value == 'Chatbot HR PHP'){
       removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="chrphp2" onchange="chrphp2(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Qonversation Q&A">Qonversation Q&A</option>
                            <option value="Transactional Q&A">Transactional Q&A</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)  //
        $(".chrphp2").last().select2()
    }
}
//flow 3.1
function boa2(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
       removenextsibling(element)
    }else if(value == 'Ticket Creation'){
      removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}
//flow 3.2
function chrphp2(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
        removenextsibling(element)
    }else if(value == 'Qonversation Q&A'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}


//flow 4 // BPM
function bpm1(element){
    let value=element.value
    console.log(value);
    if (value == '--None--'){
        removenextsibling(element)
    }else if(value == 'Asset Governance Tool-GE'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="agt1" onchange="agt2(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Transactional Q&A">Transactional Q&A</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)  
        $(".agt2").last().select2()
    }else if(value == 'Autorecon'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Group/Module/Region/Client</label>
                        <select class="Autorecon2" onchange="Autorecon2(this)" style="width="100%" required name="Group/Module/Region/Client">
                            <option value="--None--">--None--</option>
                            <option value="Connect to Agent">Connect to Agent</option>
                            <option value="Reporting Migration">Reporting Migration</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)  //
        $(".Autorecon2").last().select2()
    }
}

//flow 4.1 
function agt2(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
        removenextsibling(element)
    }else if(value == 'Transactional Q&A'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}

//flow 4.2
function Autorecon2(element){
    let value=element.value
    console.log(value); //aftertypeofrequest
      
    if (value == '--None--'){
        removenextsibling(element)
    }else if(value == 'Connect to Agent'){
        removenextsibling(element)
        let htmlstr=`<div class="mb-3">
                        <label class="form-label mb-0"><span style="color:red;background: transparent;margin: 0 5px 2px 0;">*</span>Type of Data</label>
                        <select class="tc1" style="width="100%" required name="Type of Data">
                            <option value="--None--">--None--</option>
                            <option value="NA">NA</option>
                        </select>
                    </div>`
        $(".aftertypeofrequest").last().append(htmlstr)
        $(".tc1").last().select2()
    }
}