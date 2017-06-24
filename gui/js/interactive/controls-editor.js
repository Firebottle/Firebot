// Edit Button
// This fires when trying to edit a control button.
function editButton(controlId){

    // Clear Settings
    $('#edit-controls-modal input').val('');
    $('#edit-controls-modal .panel').remove();

    // Get last board settings to plug into edit modal.
    var dbSettings = new JsonDB("./user-settings/settings", true, true);
    try{
        // Get last board name.
        var gameName = dbSettings.getData('/interactive/lastBoard');

        // Get settings for last board.
        var dbControls = new JsonDB("./user-settings/controls/"+gameName, true, true);

        // Get settings for this button.
        var button = dbControls.getData('./firebot/controls/'+controlId);

        // Add in info we already have...
        loadSettings(controlId, button);

        // Show modal
        $('#edit-controls-modal').modal('toggle')

        // Initialize Save Button
        $( ".add-new-board-save" ).click(function() {
            saveControls();
        });
    } catch(err){
        errorLog('Oops, there was an error editing this control.')
        console.log(err);
    };
}

// Add More Functionality
// This button adds another pane to the settings menu.
function addMoreFunctionality(uniqueid){
    // Collapse other panels.
    $('.collapse').collapse();
    
    var customScriptOptionHtml = "";
    var dbSettings = new JsonDB("./user-settings/settings", true, true);
    try{
    	var runCustomScripts = 
        (dbSettings.getData('./settings/runCustomScripts') === true);
      if(runCustomScripts) {
        customScriptOptionHtml = 
          `<li><a href="#" uniqueid="${uniqueid}" effect="Custom Script">Custom Script</a></li>`
      }
    } catch(err) {}

    // Build our template.
    var panelTemplate = `
        <div class="panel panel-default panel${uniqueid}" effect="">
            <div class="panel-heading" role="tab" id="heading-${uniqueid}">
                <h4 class="panel-title">
                    <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse${uniqueid}" aria-expanded="true" aria-controls="collapse${uniqueid}">
                        Nothing
                    </a>
                    <button class="btn btn-danger pull-right deleteFunctionality" delete="${uniqueid}">X</button>
                </h4>
            </div>
            <div id="collapse${uniqueid}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading${uniqueid}">
                <div class="panel-body">
                    <div class="btn-group">
                        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="effect-dropdown" uniqueid="${uniqueid}">Pick Effect</span> <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu effects-menu">
                            <li><a href="#" uniqueid="${uniqueid}" effect="API Button">API Button</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Change Group">Change Group</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Change Scene">Change Scene</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Chat">Chat</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Cooldown">Cooldown</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Celebration">Celebration</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Delay">Delay</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Dice">Dice</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Game Control">Game Control</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="HTML">HTML</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Play Sound">Play Sound</a></li>
                            <li><a href="#" uniqueid="${uniqueid}" effect="Show Image">Show Image</a></li>
                            ` + customScriptOptionHtml +
                            `
                        </ul>
                    </div>
                    <div class="effect-settings-panel">
                        <div class="effect-specific-title"><h4>Please select an effect.</h4></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Throw completed template onto page.
    $('.functionality-settings .panel-group').append(panelTemplate);

    // Re-initialize the accordion.
    $('.functionality-settings #accordion').collapse()

    // Initialize Delete Buttons
    $( ".deleteFunctionality" ).click(function() {
        var uniqueid = $(this).attr('delete');
        deleteFunctionality(uniqueid);
    });

    // Initialize Effect Dropdown
    $( ".effects-menu a" ).click(function() {
        var uniqueid = $(this).attr('uniqueid');
        var effect = $(this).attr('effect');
        functionalitySwitcher(uniqueid, effect);
    });
}

// Functionality Switcher
// This swaps out all of the settings in a panel when the type is changed.
function functionalitySwitcher(uniqueid, effect){
    $('.effect-dropdown[uniqueid="'+uniqueid+'"], .panel'+uniqueid+' .panel-title a').text(effect);
    $('.panel'+uniqueid).attr("effect", effect);

    // Clear panel.
    $('.panel'+uniqueid+' .effect-settings-panel').empty();

    switch(effect) {
    case "API Button":
        var effectTemplate = apiButtonSettings(uniqueid);
        break;
    case "Change Group":
        var effectTemplate = changeGroupSettings(uniqueid);
        break;
    case "Change Scene":
        var effectTemplate = changeSceneSettings(uniqueid);
        break;
    case "Chat":
        var effectTemplate = chatSettings(uniqueid);
        break;
    case "Cooldown":
        var effectTemplate = cooldownSettings(uniqueid);
        break;
    case "Celebration":
        var effectTemplate = celebrationSettings(uniqueid);
        break;
    case "Dice":
        var effectTemplate = diceSettings(uniqueid);
        break;
    case "Game Control":
        var effectTemplate = gameControlSettings(uniqueid);
        break;
    case "HTML":
        var effectTemplate = htmlSettings(uniqueid);
        break;
    case "Play Sound":
        var effectTemplate = playSoundSettings(uniqueid);
        break;
    case "Show Image":
        var effectTemplate = showImageSettings(uniqueid);
        break;
    case "Custom Script":
        customScriptSettings(uniqueid);
        break;
    case "Delay":
        delaySettings(uniqueid);
        break;
    }
}

function delaySettings(uniqueid) {
  var effectTemplate = `
      <div class="effect-setting-container">
        <div class="effect-specific-title"><h4>How long should the delay be?</h4></div>
        <div class="input-group">
            <span class="input-group-addon" id="delay-length-effect-type">Seconds</span>
            <input type="text" class="form-control" id="delay-length-setting" aria-describedby="delay-length-effect-type" type="number">
        </div>
      </div>

      <div class="effect-info alert alert-info">
          Note: Delays dont wait for the previous effect to finish so take that into account, if required. For example, if your first effect plays a sound thats 10 seconds long and you want a 10 second delay after that sound, make the delay last 20 seconds.
      </div>
  `;

  // Put onto the page.
  $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate);
}

// Custom Script Button Settings
// Loads up the settings for custom scripts
function customScriptSettings(uniqueid) {

  function getHtmlScriptFileList() {
    var files = fs.readdirSync("./user-settings/scripts/");
    var scriptList = '';
    for(var i in files) {
      var fileName = files[i].trim();
      if(fileName.toLowerCase().endsWith(".js")) {
        scriptList += '<li><a href="#">' + fileName + '</a></li>';
      }
    }
    return scriptList;
  }
  var jsFileList = getHtmlScriptFileList();
  
  var effectTemplate = `
      <div class="effect-setting-container">
        <div class="effect-specific-title"><h4>Which script would you like to use?</h4></div>
        <div class="effect-info alert alert-info">
            Place scripts in the <a id="scriptFolderBtn" href="#" onclick="openScriptsFolder()">scripts folder</a> of the root Firebot directory, then refresh the dropdown.
        </div>
        <div class="btn-group">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="script-type">Pick One</span> <span class="caret"></span>
        </button>
        <a id="refreshScriptList" href="#" style="padding-left:5px;height:100%;"><i class="fa fa-refresh" id="refreshIcon" style="margin-top:10px;" aria-hidden="true"></i></a>
        <ul class="dropdown-menu script-dropdown">${jsFileList}</ul>
        </div>
      </div>
      <div class="effect-info" alert alert-danger>
          <strong>Warning:</strong> Only use scripts from sources you absolutely trust!
      </div>
  `;
  
  $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate); 
  
  // When an effect is clicked, change the dropdown title.
  function updateDropdownTitle(element) {
    var text = element.text();
    $(".panel"+uniqueid+" .script-type").text(text);
  }
  
  $('#refreshScriptList').click(function() {
    
    // Fancy spin animation
    $("#refreshIcon").addClass("fa-spin");
    setTimeout(function(){
      $("#refreshIcon").removeClass("fa-spin");
    }, 1000);    
    
    //Regen the script list dropdwn
    var newjsFileList = getHtmlScriptFileList();
    $(".script-dropdown").html(newjsFileList);
    
    // Reapply click event since the DOM has changed.
    $( ".panel"+uniqueid+" .script-dropdown a" ).on('click',function() {
        updateDropdownTitle($(this));
    });  
  });

  $( ".panel"+uniqueid+" .script-dropdown a" ).on('click',function() {
      updateDropdownTitle($(this));
  });

}

// API Button Settings
// Loads up the settings for the api effect type.
function apiButtonSettings(uniqueid){

    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Which API should I use?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="api-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu api-effect-dropdown">
                    <li><a href="#">Advice</a></li>
                    <li><a href="#">Cat Picture</a></li>
                    <li><a href="#">Cat Fact</a></li>
                    <li><a href="#">Dog Picture</a></li>
                    <li><a href="#">Dog Fact</a></li>
                    <li><a href="#">Aww</a></li>
                    <li><a href="#">Pokemon</a></li>
                    <li><a href="#">Number Trivia</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Who should I send this as?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="api-chat-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu api-chat-effect-dropdown">
                    <li><a href="#">Streamer</a></li>
                    <li><a href="#">Bot</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-info alert alert-danger">
            Warning: These API's pull from a third party and we have no control over the quality or content.
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate); 

    // When an effect is clicked, change the dropdown title.
    $( ".panel"+uniqueid+" .api-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .api-effect-type").text(text);
    });

    // When an effect is clicked, change the dropdown title.
    $( ".panel"+uniqueid+" .api-chat-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .api-chat-effect-type").text(text);
    });
}

// Change Scene Settings
// Loads up the settings for the change scene effect type.
function changeGroupSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Which group should I switch the person to?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="change-group-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu change-group-effect-dropdown">
                    <li><a href="#" group="default">Default</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-info alert alert-info">
            This button will move whomever clicks it to a new group (ex: From Default to "AwesomeGroup"). So, make sure you assign a scene to that group. If no groups are listed, that means you need to create a new custom group. I recommend a minimum one second cooldown on any buttons using this, otherwise you risk breaking the board.
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate); 

    // Pull in all scenes for selected board.
    // Then see which groups are using this scene as default. Get those and output to page as a selectable option.
    try{
        var usedGroups = [];

        // Get settings for last board.
        var dbControls = getCurrentBoard();
        var scenes = dbControls.getData('./firebot/scenes');

        // Loop through scenes and make array of currently used groups.
        for(scene in scenes){
            var defaults = scenes[scene].default;
            for (item of defaults){
                if(item !== "None"){
                    usedGroups.push(item);
                }
            }
        }

        // Remove duplicates from array
        var usedGroups = usedGroups.filter(function(elem, pos) {
            return usedGroups.indexOf(elem) == pos;
        })

        // Output to page
        for (group of usedGroups){
            var dropdowntemplate = `<li><a href="#">${group}</a></li>`
            $(".panel"+uniqueid+" .change-group-effect-dropdown").append(dropdowntemplate);
        }

    } catch(err){console.log(err)};

    // When an effect is clicked, change the dropdown title.
    $(".panel"+uniqueid+" .change-group-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        if(text == "Default"){
            $(".panel"+uniqueid+" .change-group-effect-type").attr('group','default').text(text);
        } else {
            $(".panel"+uniqueid+" .change-group-effect-type").attr('group',text).text(text);
        }  
    });
}

// Change Scene Settings
// Loads up the settings for the change scene effect type.
function changeSceneSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Will we be resetting scenes to default or changing them?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="change-scene-type-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu change-scene-type-effect-dropdown">
                    <li><a href="#">Change Scenes</a></li>
                    <li><a href="#">Reset Scenes</a></li>
                </ul>
            </div>
        </div>
        <div class="change-scene-wrap" style="display:none">
            <div class="effect-setting-container">
                <div class="effect-specific-title"><h4>Which group(s) should change scenes?</h4></div>
                <div class="change-scene-effect-group-select">
                    <div class="change-scene-effect-group-option custom-change-scene-group">
                        <input type="checkbox" group="default" aria-label="..."> <span>Default</span>
                    </div>
                </div>
            </div>
            <div class="effect-setting-container">
                <div class="effect-specific-title"><h4>Which scene should we change to?</h4></div>
                <div class="btn-group">
                    <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="change-scene-to-effect-type">Pick One</span> <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu change-scene-to-effect-dropdown"></ul>
                </div>
            </div>
            <div class="effect-info alert alert-info">
                This button will change the default scene for a group. This means that everyone in that group will get the buttons from whatever scene you select. I recommend a minimum one second cooldown on any buttons using this, otherwise you risk breaking the board.
            </div>
        </div>
        <div class="reset-scene-wrap" style="display:none">
            <div class="effect-setting-container">
                <div class="effect-specific-title"><h4>Which group(s) should we reset?</h4></div>
                <div class="reset-scene-effect-group-select">
                    <div class="change-scene-effect-group-option custom-change-scene-group">
                        <input type="checkbox" group="default" aria-label="..."> <span>Default</span>
                    </div>
                </div>
            </div>
            <div class="effect-info alert alert-info">
                This button will reset any groups you choose back to their default scene. This applies to everyone in the group. I recommend a minimum one second cooldown on any buttons using this, otherwise you risk breaking the board.
            </div>
        </div>

    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate); 

    // When the change scene type is picked, show settings if not reset scenes.
    $(".panel"+uniqueid+" .change-scene-type-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .change-scene-type-effect-type").text(text);
        if(text !== "Reset Scenes"){
            $('.change-scene-wrap').show();
            $('.reset-scene-wrap').hide();
        } else {
            $('.change-scene-wrap').hide();
            $('.reset-scene-wrap').show();
        }
    });

    // Pull in all scenes for selected board.
	// Then see which groups are using this scene as default. Get those and output to page as a selectable option.
    try{
        var usedGroups = [];

        // Get settings for last board.
        var dbControls = getCurrentBoard();
        var scenes = dbControls.getData('./firebot/scenes');

        // Loop through scenes and make array of currently used groups.
        for(scene in scenes){
            var defaults = scenes[scene].default;
            for (item of defaults){
                if(item !== "None"){
                    usedGroups.push(item);
                }
            }
        }

        // Remove duplicates from array
        var usedGroups = usedGroups.filter(function(elem, pos) {
            return usedGroups.indexOf(elem) == pos;
        })

        // Output to page
        for (group of usedGroups){
            var template = `
				<div class="change-scene-effect-group-option custom-change-scene-group">
					<input type="checkbox" group="${group}" aria-label="..."> <span>${group}</span>
				</div>
			`;
			$('.change-scene-effect-group-select, .reset-scene-effect-group-select').append(template);
        }

    } catch(err){console.log(err)};

    // Load up all scenes into the scene dropdown.
    var dbSettings = new JsonDB("./user-settings/settings", true, true);
    try{
        // Get last board name.
        var gameName = dbSettings.getData('/interactive/lastBoard');
        // Get settings for last board.
        var dbControls = new JsonDB("./user-settings/controls/"+gameName, true, true);
        var scenes = dbControls.getData('./firebot/scenes');

        // Throw scenes onto the page.
        for(scene in scenes){
            var template = `<li><a href="#">${scene}</a></li>`;
            $('.change-scene-to-effect-dropdown').append(template);
        }
    } catch(err){console.log(err);};


    // When a scene is clicked, change the dropdown title.
    $(".panel"+uniqueid+" .change-scene-to-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .change-scene-to-effect-type").text(text);
    });
}

// Chat Settings
// Loads up settings for the chat effect type.
function chatSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Who should I chat as?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="chat-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu chat-effect-dropdown">
                    <li><a href="#">Streamer</a></li>
                    <li><a href="#">Bot</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>What should I say?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="chat-text-effect-type">Message</span>
                <input type="text" class="form-control" id="chat-text-setting" aria-describedby="chat-text-effect-type" maxlength="360">
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Who should I whisper this to? Leave blank to broadcast to everyone.</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="chat-whisper-effect-type">Whisper</span>
                <input type="text" class="form-control" id="chat-whisper-setting" aria-describedby="chat-text-effect-type">
            </div>
        </div>
        <div class="effect-info alert alert-info">
            The variable $(user) will be replaced by the username of the person who pressed the button. EX: If Firebottle hits a button you can whisper him.
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate); 

    // When an effect is clicked, change the dropdown title.
    $( ".panel"+uniqueid+" .chat-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .chat-effect-type").text(text);
    });
}

// Cooldown Button Settings
// Loads up the settings for the cooldown effect type.
function cooldownSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Which buttons should I put on cooldown?</h4></div>
            <div class="cooldown-group-buttons"></div>
            <div class="cooldown-group-button-reset">
                <button class="btn btn-warning">Uncheck all</button>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>How long should these cooldown for?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="cooldown-amount-effect-type">Seconds</span>
                <input type="text" class="form-control" id="cooldown-amount-setting" aria-describedby="cooldown-amount-effect-type" type="number">
            </div>
        </div>
        <div class="effect-info alert alert-info">
            If you want to cool down a lot of buttons at the same time, give the cooldown groups a try in the board main settings!
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate);

    // Pull in all buttons for selected board.
    try{
        // Get settings for last board.
        var dbControls = getCurrentBoard();

        // Get settings for this button.
        var scenes = dbControls.getData('./mixer');

        // Loop through scenes and put buttons into dropdown menu.
        for (scene of scenes){
            var controls = scene.controls;
            for (button of controls){
                var name = button.controlID;
                var template = `
                    <div class="cooldown-group-button-option">
                        <input type="checkbox" button="${name}" aria-label="..."> <span>${name}</span>
                    </div>
                `;

                $('.panel'+uniqueid+' .cooldown-group-buttons').append(template);
            }
        }
    } catch(err){};

    // Initialize uncheck button.
    $('.panel'+uniqueid+' .cooldown-group-button-reset button').click(function(){
        $('.panel'+uniqueid+' .cooldown-group-button-option input').prop('checked', false);
    });
}

// Celebration Button Settings
// Loads up the settings for the celebration effect type.
function celebrationSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>How should we celebrate?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="celebrate-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu celebrate-effect-dropdown">
                    <li><a href="#">Fireworks</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>How many seconds should the party last?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="celebration-length-effect-type">Seconds</span>
                <input type="text" class="form-control" id="celebration-amount-setting" aria-describedby="celebration-length-effect-type" type="number">
            </div>
        </div>
        <div class="effect-info alert alert-info">
            This effect requires the overlay file to be loaded into your streaming software. Look in the Firebot folder for "/overlay/firebot.html".
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate);

    // When an effect is clicked, change the dropdown title.
    $( ".panel"+uniqueid+" .celebrate-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .celebrate-effect-type").text(text);
    });
}

// Dice Settings
// Loads up settings for the dice effect type.
function diceSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Who should I announce the roll as?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="dice-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu dice-effect-dropdown">
                    <li><a href="#">Streamer</a></li>
                    <li><a href="#">Bot</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Who should I whisper this to? Leave blank to broadcast to everyone.</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="dice-whisper-effect-type">Whisper</span>
                <input type="text" class="form-control" id="dice-whisper-setting" aria-describedby="dice-text-effect-type">
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>What should I roll?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="dice-text-effect-type">Dice</span>
                <input type="text" class="form-control" id="dice-text-setting" aria-describedby="dice-text-effect-type" placeholder="2d20 or 2d10+1d12 or 1d10+3">
            </div>
        </div>
        <div class="effect-info alert alert-info">
            The variable $(user) will be replaced by the username of the person who pressed the button. EX: If Firebottle hits a button you can whisper him.
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate); 

    // When an effect is clicked, change the dropdown title.
    $( ".panel"+uniqueid+" .dice-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .dice-effect-type").text(text);
    });
}

// Game Control Button Settings
// Loads up the settings for the game control effect type.
function gameControlSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Which button should I press?</h4></div>
            <div class="input-group game-press">
                <span class="input-group-addon" id="button-press-effect-type">Press</span>
                <input type="text" class="form-control" id="game-control-press-setting" aria-describedby="button-press-effect-type">
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Should we press any modifiers also?</h4></div>
            <div class="button-press-modifier-effect-type">
                <div class="button-press-modifier-effect-inputs">
                    <input type="checkbox" key="control" aria-label="..."> <span>Control</span> <br>
                    <input type="checkbox" key="alt" aria-label="..."> <span>Alt</span> <br>
                    <input type="checkbox" key="shift" aria-label="..."> <span>Shift</span>
                </div>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Does this button have an opposite button? (EX: Game Movement)</h4></div>
            <div class="input-group game-opposite">
                <span class="input-group-addon" id="opposite-button-effect-type">Opposite</span>
                <input type="text" class="form-control" id="game-control-opposite-setting" aria-describedby="opposite-button-effect-type">
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Is this a button that should be held down?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="holding-button-effect-type">No</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu holding-button-effect-dropdown">
                    <li><a href="#">No</a></li>
                    <li><a href="#">Yes</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-info alert alert-info">
            Game controls do not work in every game or with every program. These are emulated controls. If the controls aren't working on your game or app try changing the emulator in the app settings.
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate);

    // Apply autocomplete
    $(".panel"+uniqueid+" #game-control-press-setting").autocomplete({
      source: gameAutoComplete(),
      appendTo: ".panel"+uniqueid+" .game-press"
    });
    $(".panel"+uniqueid+" #game-control-opposite-setting").autocomplete({
      source: gameAutoComplete(),
      appendTo: ".panel"+uniqueid+" .game-opposite"
    });


    // When an effect is clicked, change the dropdown title.
    $( ".panel"+uniqueid+" .holding-button-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .holding-button-effect-type").text(text);
    });
}

// Show HTML Settings
// Loads up the settings for the show HTML effect type.
function htmlSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>What HTML should we output?</h4></div>
            <div class="input-group">
                <textarea class="form-control" id="html-effect-html-field" name="text" placeholder="Input your HTML" rows="5" cols="40" width="100%"></textarea>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>How long should it show?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="html-length-effect-type">Seconds</span>
                <input type="text" class="form-control" id="html-length-setting" aria-describedby="html-length-effect-type" type="number">
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>What item should I remove after the show timer expires?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="html-selector-effect-type">CSS Class</span>
                <input type="text" class="form-control" id="html-selector-setting" aria-describedby="html-selector-effect-type">
            </div>
        </div>
        <div class="effect-info alert alert-info">
            This effect requires the overlay file to be loaded into your streaming software. Look in the Firebot folder for "/overlay/firebot.html". Also, please be aware that this button is EXTREMELY prone to error due to open ended nature.
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate);
}

// Play Sound Settings
// Loads up the settings for the play sound effect type.
function playSoundSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>What sound should I play?</h4></div>
            <div class="input-group">
                <span class="input-group-btn">
                <button class="btn btn-default play-sound-effect-chooser" type="button">Choose</button>
                </span>
                <input type="text" class="form-control play-sound-effect-input">
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>How loud should it be?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="volume-effect-type">1-10</span>
                <input type="text" class="form-control" id="sound-volume-setting" aria-describedby="volume-effect-type" type="number" min="1" max="10">
            </div>
        </div>
        <div class="effect-info alert alert-info">
            FYI, sounds are played through the Firebot app itself and not the overlay file.
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate);

    // Audio File Selector
    // This monitors the audio file select box and when it is clicked sends request to main process to open dialog.
    $(".panel"+uniqueid+" .play-sound-effect-chooser" ).click(function() {
        ipcRenderer.send('getSoundPath', uniqueid);
    });

}

// Show Image Settings
// Loads up the settings for the show image effect type.
function showImageSettings(uniqueid){
    var effectTemplate = `
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>Which image should I show?</h4></div>
            <div class="input-group">
                <span class="input-group-btn">
                <button class="btn btn-default show-image-effect-chooser" type="button">Choose</button>
                </span>
                <input type="text" class="form-control show-image-effect-input">
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>What location should it show in?</h4></div>
            <div class="btn-group">
                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="image-placement-effect-type">Pick One</span> <span class="caret"></span>
                </button>
                <ul class="dropdown-menu image-placement-effect-dropdown">
                    <li><a href="#">Top Left</a></li>
                    <li><a href="#">Top Middle</a></li>
                    <li><a href="#">Top Right</a></li>
                    <li><a href="#">Middle Left</a></li>
                    <li><a href="#">Middle</a></li>
                    <li><a href="#">Middle Right</a></li>
                    <li><a href="#">Bottom Left</a></li>
                    <li><a href="#">Bottom Middle</a></li>
                    <li><a href="#">Bottom Right</a></li>
                </ul>
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>How big should it be?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="image-size-type">Height (in pixels)</span>
                <input type="text" class="form-control" id="image-height-setting" aria-describeby="image-height-setting-type" type="number">
                <span class="input-group-addon" id="image-size-type">Width (in pixels)</span>
                <input type="text" class="form-control" id="image-width-setting" aria-describeby="image-width-setting-type" type="number">
            </div>
            <div class="effect-info alert alert-info">
                Just put numbers in the fields (ex: 250). This will set the max width/height of the image and scale it down proportionally.
            </div>
        </div>
        <div class="effect-setting-container">
            <div class="effect-specific-title"><h4>How long should it show?</h4></div>
            <div class="input-group">
                <span class="input-group-addon" id="image-length-effect-type">Seconds</span>
                <input type="text" class="form-control" id="image-length-setting" aria-describedby="image-length-effect-type" type="number">
            </div>
        </div>
        <div class="effect-info alert alert-info">
            This effect requires the overlay file to be loaded into your streaming software. Look in the Firebot folder for "/overlay/firebot.html".
        </div>
    `;

    // Put onto the page.
    $('.panel'+uniqueid+' .effect-settings-panel').append(effectTemplate);

    // When an effect is clicked, change the dropdown title.
    $( ".panel"+uniqueid+" .image-placement-effect-dropdown a" ).click(function() {
        var text = $(this).text();
        $(".panel"+uniqueid+" .image-placement-effect-type").text(text);
    });

    // Image File Selector
    // This monitors the audio file select box and when it is clicked sends request to main process to open dialog.
    $(".panel"+uniqueid+" .show-image-effect-chooser" ).click(function() {
        ipcRenderer.send('getImagePath', uniqueid);
    });
}

// Game Button Autocomplete
function gameAutoComplete(){
    var availableButtons = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "backspace",
        "delete",
        "enter",
        "space",
        "tab",
        "escape",
        "up",
        "down",
        "left",
        "right",
        "home",
        "end",
        "pageup",
        "pagedown",
        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6",
        "f7",
        "f8",
        "f9",
        "f10",
        "f11",
        "f12",
        "alt",
        "control",
        "shift",
        "numpad_0",
        "numpad_1",
        "numpad_2",
        "numpad_3",
        "numpad_4",
        "numpad_5",
        "numpad_6",
        "numpad_7",
        "numpad_8",
        "numpad_9",
        "leftmouse",
        "middlemouse",
        "rightmouse"
    ];

    return availableButtons;
}

// Delete Functionality
// This button deletes functionality on the button settings page.
function deleteFunctionality(uniqueid){
    $('.panel'+uniqueid).remove();
}


//////////////
// SAVING
/////////////

// Save Controls
// This runs when the save button is clicked in the controls editor modal.
function saveControls(){

    // Get the current board.
    var dbControls = getCurrentBoard();

    // General Settings
    var controlID = $('.settings-controlid input').val();
    var buttontext = $('.settings-buttontext input').val();
    var sparkcost = $('.settings-sparkcost input').val();
    var cooldown = $('.settings-cooldown input').val();

    // TO DO: Push new values to mixer for sparkcost and button text.

    // Make sure we don't lose any settings that are set in places other than the individual button settings.
    // Check for pre-existing Cooldown Groups
    try{
        var cooldownGroup = dbControls.getData('./firebot/controls/'+controlID+'/cooldownGroup');
    }catch(err){
        var cooldownGroup = "";
    }
    // Check for pre-existing Scenes
    try{
        var scene = dbControls.getData('./firebot/controls/'+controlID+'/scene');
    }catch(err){
        var scene= "default";
    }

    // Push new values to settings.
    dbControls.push('./firebot/controls/'+controlID, {"controlId": controlID, "text": buttontext, "cost": sparkcost, "scene": scene, "cooldown": cooldown, "cooldownGroup": cooldownGroup});

    // Clear all previously saved effects.
    dbControls.delete('./firebot/controls/'+controlID+'/effects');

    // Effect Settings
    // Loop through each effect.
    var i = 1;
    $( ".functionality-settings .panel-group .panel" ).each(function( index ) {
        var effect = $(this).attr('effect');
        switch(effect) {
        case "API Button":
            var apiType = $(this).find('.api-effect-type').text();
            var chatter = $(this).find('.api-chat-effect-type').text();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "API Button", "api": apiType, "chatter": chatter});
            break;
        case "Change Group":
            var groupChange = $(this).find('.change-group-effect-type').attr('group');
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Change Group", "scene": groupChange});
            break;
        case "Change Scene":
            var changeSceneType = $(this).find('.change-scene-type-effect-type').text();
            // Change scene or reset scene?
            if(changeSceneType == "Change Scenes"){
                // Loop through and grab groups.
                var changeSceneGroups = [];
                $(this).find('.change-scene-effect-group-option input').each(function( index ) {
                    if( $(this).prop('checked') === true && $(this).is(":visible") ){
                        changeSceneGroups.push( $(this).attr('group') );
                    }
                });
                // Grab scene to switch to and then push to db.
                var scene = $('.change-scene-to-effect-type').text();
                dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Change Scene", "scene": scene, "groups": changeSceneGroups, "reset": false});
            } else if (changeSceneType == "Reset Scenes"){
                // Loop through and grab groups.
                var resetSceneGroups = [];
                $(this).find('.change-scene-effect-group-option input').each(function( index ) {
                    if( $(this).prop('checked') === true && $(this).is(":visible") ){
                        resetSceneGroups.push( $(this).attr('group') );
                    }
                });
                // Push to db.
                dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Change Scene", "groups": resetSceneGroups, "reset": true});
            }
            break;
        case "Chat":
            var chatter = $(this).find('.chat-effect-type').text();
            var message = $(this).find('#chat-text-setting').val();
            var whisper = $(this).find('#chat-whisper-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Chat", "chatter": chatter, "message": message, "whisper": whisper});
            break;
        case "Cooldown":
            // Cycle through selected buttons and push to array.
            var cooldownButtons = [];
            // Loop through selected buttons and get control id.
            $(this).find('.cooldown-group-button-option input:checked').each(function( index ) {
                var button = $(this).attr('button');
                cooldownButtons.push(button);
            });
            var cooldownLength = $(this).find('#cooldown-amount-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Cooldown", "buttons": cooldownButtons, "length": cooldownLength});
            break;
        case "Celebration":
            var celebration = $(this).find('.celebrate-effect-type').text();
            var celebrationLength = $(this).find('#celebration-amount-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Celebration", "celebration": celebration, "length": celebrationLength});
            break;
        case "Dice":
            var chatter = $(this).find('.dice-effect-type').text();
            var whisper = $(this).find('#dice-whisper-setting').val();
            var dice = $(this).find('#dice-text-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Dice", "chatter": chatter, "dice": dice, "whisper": whisper});
            break;
        case "Game Control":
            var buttonPress = $(this).find('#game-control-press-setting').val();
            var oppositeButton = $(this).find('#game-control-opposite-setting').val();
            var holdingButton = $(this).find('.holding-button-effect-type').text();

            // Get modifiers
            var modifierButtons = [];
            $(this).find('.button-press-modifier-effect-inputs input').each(function( index ) {
                if( $(this).prop('checked') === true && $(this).is(":visible") ){
                    modifierButtons.push( $(this).attr('key') );
                }
            });

            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Game Control", "press": buttonPress, "modifiers": modifierButtons, "opposite": oppositeButton, "holding": holdingButton});
            break;
        case "HTML":
            var html = $(this).find('#html-effect-html-field').val();
            var showtime = $(this).find('#html-length-setting').val();
            var removal = $(this).find('#html-selector-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "HTML", "html": html, "length": showtime, "removal": removal});
            break;
        case "Play Sound":
            var soundFile = $(this).find('.play-sound-effect-input').val();
            var soundVolume = $(this).find('#sound-volume-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Play Sound", "file": soundFile, "volume": soundVolume});
            break;
        case "Show Image":
            var imageFile = $(this).find('.show-image-effect-input').val();
            var imagePlacement = $(this).find('.image-placement-effect-type').text();
            var imageHeight = $(this).find('#image-height-setting').val();
            var imageWidth = $(this).find('#image-width-setting').val();
            var imageLength = $(this).find('#image-length-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Show Image", "file": imageFile, "position": imagePlacement, "height": imageHeight, "width": imageWidth , "length": imageLength});
            break;
        case "Custom Script":
            var scriptName = $(this).find('.script-type').text();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Custom Script", "scriptName": scriptName});
            break;
        case "Delay":
            var delay = $(this).find('#delay-length-setting').val();
            dbControls.push('./firebot/controls/'+controlID+'/effects/'+i, {"type": "Delay", "delay": delay});
            break;
        }
        i++
    });
}

//////////////
// Loading
/////////////

// Load Settings
// This function kickstarts the process of loading already saved settings on edit.
function loadSettings(controlId, button){
    var effects = button.effects;

    // Load up general settings
    $('.edit-title-controlid').text(controlId);
    $('.settings-controlid input').val(controlId);
    $('.settings-buttontext input').val(button.text);
    $('.settings-sparkcost input').val(button.cost);
    $('.settings-cooldown input').val(button.cooldown);

    // Start on the effects.
    if (effects !== undefined){
        for (var i = 1; i < Object.keys(effects).length +1; i++) { 
            var effect = effects[''+i+''];
            var effectType = effect.type; 

            // Create panels
            var uniqueid = getUniqueId();
            addMoreFunctionality(uniqueid);
            functionalitySwitcher(uniqueid, effectType);

            // Now it's time to load up the settings for each.
            switch(effectType) {
            case "API Button":
                $('.panel'+uniqueid+' .api-effect-type').text(effect.api);
                $('.panel'+uniqueid+' .api-chat-effect-type').text(effect.chatter);
                break;
            case "Change Group":
                var scene = effect.scene;
                if(scene == "default"){
                    $('.panel'+uniqueid+' .change-group-effect-type').attr('group', scene).text('Default');
                } else {
                    $('.panel'+uniqueid+' .change-group-effect-type').attr('group', scene).text(effect.scene);
                }
                break;
            case "Change Scene":
                if ( effect.reset === true){
                    // We're loading up the reset settings.
                    $('.change-scene-type-effect-type').text('Reset Scenes');
                    $('.reset-scene-wrap').show();
                    $('.change-scene-wrap').hide();

                    // Loop through and check groups.
                    for (group of effect.groups){
                        $('.change-scene-effect-group-option input[group = '+group+']').prop('checked', true);
                    }
                } else if (effect.reset === false){
                    // We're loading up the change scene settings.
                    $('.change-scene-type-effect-type').text('Change Scenes');
                    $('.reset-scene-wrap').hide();
                    $('.change-scene-wrap').show();

                    // Loop through and check groups.
                    for (group of effect.groups){
                        $('.change-scene-effect-group-option input[group = '+group+']').prop('checked', true);
                    }

                    // Change scene select dropdown.
                    $('.change-scene-to-effect-type').text(effect.scene);
                }
                break;
            case "Chat":
                $('.panel'+uniqueid+' .chat-effect-type').text(effect.chatter);
                $('.panel'+uniqueid+' #chat-text-setting').val(effect.message);
                $('.panel'+uniqueid+' #chat-whisper-setting').val(effect.whisper);
                break;
            case "Cooldown":
                // Cycle through selected buttons and push to array.
                var cooldownButtons = effect.buttons;
                for (button of cooldownButtons){
                    $('.panel'+uniqueid+' .cooldown-group-button-option input[button="'+button+'"]').prop('checked', true);
                }
                $('.panel'+uniqueid+' #cooldown-amount-setting').val(effect.length);
                break;
            case "Celebration":
                $('.panel'+uniqueid+' .celebrate-effect-type').text(effect.celebration);
                $('.panel'+uniqueid+' #celebration-amount-setting').val(effect.length);
                break;
            case "Dice":
                $('.panel'+uniqueid+' .dice-effect-type').text(effect.chatter);
                $('.panel'+uniqueid+' #dice-text-setting').val(effect.dice);
                $('.panel'+uniqueid+' #dice-whisper-setting').val(effect.whisper);
                break;
            case "Game Control":
                $('.panel'+uniqueid+' #game-control-press-setting').val(effect.press);
                $('.panel'+uniqueid+' #game-control-opposite-setting').val(effect.opposite);
                $('.panel'+uniqueid+' .holding-button-effect-type').text(effect.holding);
                // Loop through and check groups.
                for (modifier of effect.modifiers){
                    $('.button-press-modifier-effect-inputs input[key = '+modifier+']').prop('checked', true);
                }

                break;
            case "HTML":
                $('.panel'+uniqueid+' #html-effect-html-field').val(effect.html);
                $('.panel'+uniqueid+' #html-length-setting').val(effect.length);
                $('.panel'+uniqueid+' #html-selector-setting').val(effect.removal);
                break;
            case "Play Sound":
                $('.panel'+uniqueid+' .play-sound-effect-input').val(effect.file);
                $('.panel'+uniqueid+' #sound-volume-setting').val(effect.volume);
                break;
            case "Show Image":
                $('.panel'+uniqueid+' .show-image-effect-input').val(effect.file);
                $('.panel'+uniqueid+' .image-placement-effect-type').text(effect.position);
                $('.panel'+uniqueid+' #image-height-setting').val(effect.height);
                $('.panel'+uniqueid+' #image-width-setting').val(effect.width);
                $('.panel'+uniqueid+' #image-length-setting').val(effect.length);
                break;
            case "Custom Script":
                $('.panel'+uniqueid+' .script-type').text(effect.scriptName);
            case "Delay":
                $('.panel'+uniqueid+' #delay-length-setting').val(effect.delay);
                break;
            }
        }
    }
}

// Got Sound File Path
// Recieves event from main process that a sound file path has been recieved.
ipcRenderer.on('gotSoundFilePath', function (event, data){
    var uniqueid = data.id;
    $('.panel'+uniqueid+' .play-sound-effect-input').val(data.path[0]);
});

// Got Image File Path
// Recieves event from main process that an image file path has been recieved.
ipcRenderer.on('gotImageFilePath', function (event, data){
    var uniqueid = data.id;
    $('.panel'+uniqueid+' .show-image-effect-input').val(data.path[0]);
});

//////////////////////
// On Click Functions
/////////////////////

// Button that adds more functionality in settings area.
$( ".add-more-functionality button" ).click(function() {
    var uniqueid = getUniqueId();
    addMoreFunctionality(uniqueid);
});
