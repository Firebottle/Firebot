(function(){
  
 // This provides helper methods for control effects
 
 const _ = require('underscore')._;
 
 const EffectType = require('../../lib/interactive/EffectType.js').EffectType;

 angular
  .module('firebotApp')
  .factory('effectHelperService', function () {
    var service = {};
      
    // Returns a controller to be used for the template of a given effectype
    service.getControllerForEffectTypeTemplate = function(effectType) {
      // Default empty controller. We can override it in the switch statement below.
      var controller = ($scope) => {};
      
      switch(effectType) {
        
        case EffectType.PLAY_SOUND:
          controller = ($scope, listenerService) => {
            
            var uuid = _.uniqueId();
            
            $scope.openFileExporer = function() {
              var registerRequest = {
                type: listenerService.ListenerType.SOUND_FILE,
                uuid: uuid,
                runOnce: true,
                publishEvent: true
              }
              listenerService.registerListener(registerRequest, (filepath) => {
                $scope.effect.file = filepath;
              });
            };    
          };
          break;
          
        case EffectType.SHOW_IMAGE:
          controller = ($scope, listenerService) => {
            
            $scope.imagePositions = [
              "Top Left",
              "Top Middle",
              "Top Right",
              "Middle Left",
              "Middle",
              "Middle Right",
              "Bottom Left",
              "Bottom Middle",
              "Bottom Right"
            ];
            
            var uuid = _.uniqueId(); 
            
            $scope.openFileExporer = function() {
              var registerRequest = {
                type: listenerService.ListenerType.IMAGE_FILE,
                uuid: uuid,
                runOnce: true,
                publishEvent: true
              }
              listenerService.registerListener(registerRequest, (filepath) => {
                $scope.effect.file = filepath;
              });
            };         
          };
          break;

        case EffectType.API_BUTTON:
          controller = ($scope) => {

            $scope.apiTypes = [
              "Advice",
              "Cat Picture",
              "Cat Fact",
              "Dog Picture",
              "Dog Fact",
              "Aww",
              "Pokemon",
              "Number Trivia"
            ]

          };
          break;

        case EffectType.CHANGE_GROUP:
          controller = ($scope, groupsService) => {

            // Load up viewer groups if they haven't been already.
            // Leaving this out causes no groups to load unless you first visit the groups panel.
            groupsService.loadViewerGroups();

            // Get viewer groups and push group name to scope.
            $scope.viewerGroups = [];
            var groups = groupsService.getViewerGroups();
            for (group of groups){
              $scope.viewerGroups.push(group.groupName);
            }

          };
          break;

        case EffectType.CHANGE_SCENE:
          controller = ($scope, groupsService, boardService) => {

            // Make the Change Scene option user friendly text.
            // EX: effect.reset = false should show as "Reset Scenes" in the ui.
            $scope.ufChangeSceneOption = function(){
              if($scope.effect.reset){
                return "Reset Scenes"
              } else if($scope.effect.reset === false){
                return "Change Scenes"
              } else {
                return "Pick One"
              }
            }

            // Load up viewer groups if they haven't been already.
            // Leaving this out causes no groups to load unless you first visit the groups panel.
            groupsService.loadViewerGroups();

            // Get viewer groups and push group name to scope.
            // This is for loading up all user group checkboxes.
            $scope.viewerGroups = [];
            var groups = groupsService.getViewerGroups();
            for (group of groups){
              $scope.viewerGroups.push(group.groupName);
            }

            // This is run each time a group checkbox is clicked or unclicked.
            // This will build an array of currently selected groups to be saved to JSON.
            $scope.groupArray = function(list, item){
              $scope.effect.groups = service.getCheckedBoxes(list, item);
              console.log($scope.effect.groups)
            }

            // This uses the board service to get a list of scenes for the current board.
            $scope.getScenesForSelectedBoard = function(){
              return boardService.getScenesForSelectedBoard();
            }

            // This checks if an item is in the effect.group array and returns true.
            // This allows us to check boxes when loading up this button effect.
            $scope.groupCheckboxer = function (list, item){
              return service.checkSavedArray(list, item);         
            }

          };
          break;

        case EffectType.COOLDOWN:
          controller = ($scope, boardService) => {
          
            // Get all control id's in an array so we can add checkboxes.
            $scope.boardButtons = boardService.getControlIdsForSelectedBoard();

            // This sets the effect.buttons to an array of checked items.
            $scope.buttonArray = function(list, item){
              $scope.effect.buttons = service.getCheckedBoxes(list, item);
            }

            // This checks if an item is in the effect.buttons array and returns true.
            // This allows us to check boxes when loading up this button effect.
            $scope.buttonCheckboxer = function (list, item){
              return service.checkSavedArray(list, item);         
            }
            
          };
          break;

        case EffectType.CELEBRATION:
          controller = ($scope) => {

            $scope.celebrationTypes = [
              "Fireworks"
            ]

          };
          break;

        case EffectType.CUSTOM_SCRIPT:
          controller = ($scope) => {

            // Grab files in folder when button effect shown.
            $scope.scriptArray = fs.readdirSync('./user-settings/scripts');

            // Grab files in folder on refresh click.
            $scope.getNewScripts = function (){
              $scope.scriptArray = fs.readdirSync('./user-settings/scripts');
            }

            // Open script folder on click.
            $scope.openScriptsFolder = function(){
              ipcRenderer.send('openScriptsFolder');
            }

          };
          break;

      }
      
      return controller;
    }

    // This is an object that will get passed into the scope of every effect type template
    // containing common options that appear in more than one effect
    service.commonOptionsForEffectTypes = {
      chatters: ['Streamer', 'Bot']
    }
    
    // Generate the template file path based off of the effect type
    service.getTemplateFilePathForEffectType = function(effectType) {
      var normalizedEffectType = ""
      if(effectType != null) {
        normalizedEffectType = effectType.toLowerCase().replace(' ', '-');
      } else {
        normalizedEffectType = "no-effect-type-provided";
      }
      return './templates/interactive/effect-options/' + normalizedEffectType + '.html';
    }

    // This is used by effects that make use of lists of checkboxes. Returns and array of selected boxes.
    service.getCheckedBoxes = function (list, item){
        if(list != null){
          var itemArray = list;
        } else {
          var itemArray = [];
        }              
        
        try{
          var itemIndex = itemArray.indexOf(item);
        } catch(err){
          var itemIndex = -1;
        }

        if(itemIndex != -1){
          // Item exists, so we're unchecking it.
          itemArray.splice(itemIndex, 1);
        } else {
          // Item doesn't exist! Add it in.
          itemArray.push(item);
        }

        // Set new scope var.
        return itemArray;
    }

    // This is used to check for an item in a saved array and returns true if it exists.
    service.checkSavedArray = function(list, item){
      if(list != null) {
        return list.indexOf(item) != -1;
      } else {
        return false;
      }              
    }

    
    return service;
  });
})();