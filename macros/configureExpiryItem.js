let expirySettings = {
  stages: {
      1: null,
      2: null
  },
};
let stayOpen = false; // Custom flag to control parent dialog closing

let itemDropdown = "";
const loadoutsTypes = "gear"

for(const loadoutsType of loadoutsTypes.split(',')){
    itemDropdown +="<option disabled>" + loadoutsType.toUpperCase() + "</option>"
    var itemArray = game.items.filter(item => item.type == loadoutsType).sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 0; i < itemArray.length; i++) {
        var isConfigured
        if(itemArray[i].flags.loadouts){
            if(itemArray[i].flags.loadouts.configured == true){
                isConfigured = "&#x25C9;"
            } else {
                isConfigured = "&#x25CC;"
            }
        } else {
            isConfigured = "&#x25CC;"
        }
        itemDropdown += "<option value='" + itemArray[i].id + "'>" + itemArray[i].name + " " + isConfigured + "</option>";
    }
}

// Create the parent dialog
const parentDialog = new Dialog({
title: "Expiry Item Configuration",
content: `
<form class="form-horizontal">
<fieldset>

  <!-- Form Name -->
  <legend>Item Configuration</legend>
  <!-- Item Dropdown -->
  
  <div class="form-group">
      <label for="selectedItems" style='display:inline-block;'>Select Item(s)</label>
      <select id="selectedItems" name="selectedItems" multiple style='width:58%; margin:4px 1%; display:inline-block;'>` + itemDropdown + `</select>
  </div>
  
  <!-- Decay Time Configuration -->
  <div class="form-group">
      <label for="decayAmount" style='display:inline-block;'>Decay Time:</label>
      <select id="decayAmount" name="decayAmount" style='width:20%; margin:4px 1%; display:inline-block;'>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <!-- Add more options up to 12 as needed -->
      </select>
      <select id="decayUnit" name="decayUnit" style='width:30%; margin:4px 1%; display:inline-block;'>
          <option value="Minutes">Minutes</option>
          <option value="Hours">Hours</option>
          <option value="Days">Days</option>
          <option value="Years">Years</option>
      </select>
  </div>

</fieldset>
</form>

<style>
  #savingThrowSelector .dialog-buttons {
      flex-direction: column;
  }
</style>
`,

buttons: {
  stage1: {
    icon: "<i class='fas fa-cog'></i>",
    label: "Configure Stage 1",
    callback: async () => {
      stayOpen = true; // Set the flag to keep the parent dialog open
      openChildDialog(1);
    },
  },
  stage2: {
    icon: "<i class='fas fa-cog'></i>",
    label: "Configure Stage 2",
    callback: async () => {
      stayOpen = true; // Set the flag to keep the parent dialog open
      openChildDialog(2);
    },
  },
  reset: {
    icon: "<i class='fas fa-undo'></i>",
    label: "Reset",
    callback: async () => {
      // Handle the Cancel button logic here
      console.log("Cancel button clicked");
      parentDialog.close(); // Close the parent dialog
    },
  },
  help: {
    icon: "<i class='fas fa-info-circle'></i>",
    label: "Help",
    callback: async () => {
      // Handle the Cancel button logic here
      console.log("Help button clicked");
      stayOpen = true; // Set the flag to keep the parent dialog open
      openHelpDialog(); // Close the parent dialog
    },
  },
  apply: {
    icon: "<i class='fas fa-check'></i>",
    label: "Apply",
    callback: async () => {
      // Handle the Apply button logic here
      console.log("Apply button clicked");
      console.log(settings); // Access the collected settings from child dialogs
      parentDialog.close(); // Close the parent dialog
    },
  },
  cancel: {
    icon: "<i class='fas fa-times'></i>",
    label: "Cancel",
    callback: async () => {
      // Handle the Cancel button logic here
      console.log("Cancel button clicked");
      parentDialog.close(); // Close the parent dialog
    },
  },
},
close: () => {
  console.log(settings);
  if (stayOpen) {
    stayOpen = false; // Reset the flag
    parentDialog.render(true); // Re-render the parent dialog to keep it open
  }
},
closeOnSubmit: false // Prevent the parent dialog from closing on submission
}, {id: "savingThrowSelector"}).render(true);

// Function to open a child dialog
function openChildDialog(stageInt) {
const dialog = new Dialog({
  title: `Expiry Stage ${stageInt} Settings`,
  content: `
    <form id="expiry-options-form">
      <div class="form-group">
        <label>Action:</label>
        <div class="main-options">

          <fieldset class="option-group">
            <legend>Revise</legend>
            <label>
              <input type="radio" name="main-option" value="revise"> Revise
            </label>
            <div class="settings">
              <label>Prefix:</label>
              <input type="text" name="prefix" class="text-input">
              <label>Suffix:</label>
              <input type="text" name="suffix" class="text-input">
              <label>Image:</label>
              <input type="text" name="img" class="text-input">
            </div>
          </fieldset>
          
          <fieldset class="option-group">
            <legend>Replace</legend>
            <label>
              <input type="radio" name="main-option" value="replace"> Replace
            </label>
            <div class="settings">
              <label>Item:</label>
              <input type="text" name="replacementItem" class="text-input">
            </div>
          </fieldset>

          <fieldset class="option-group">
            <legend>Remove</legend>
            <label>
              <input type="radio" name="main-option" value="remove"> Remove
            </label>
            <div class="settings">
              <!-- Remove settings go here -->
            </div>
          </fieldset>
        </div>
      </div>

      <div class="form-group">
      <label>Notification (optional):</label>
      <div class="notification-options">
          <fieldset class="option-group">
            <legend>UI Message</legend>
            <div class="settings">
              <label>Message:</label>
                <input type="text" name="message" class="text-input">
              <label>Send to:</label>
                <br>
                <input type="checkbox" name="console"> Console
              </label>
              <label>
                <input type="checkbox" name="chat"> Chat
              </label>
              <label>
                <input type="checkbox" name="ui"> UI
              </label>
            </div>
          </fieldset>
        </div>
      </div>

    </form>
  `,
  buttons: {
    apply: {
      icon: "<i class='fas fa-check'></i>",
      label: `Apply`,
      callback: async (html) => {
        // Handle the user's selections here
        const mainOption = html.find('[name="main-option"]:checked').val();
        let stageSettings;

        if (mainOption === "revise") {
          stageSettings = {
            action: revise,
            prefix: html.find('[name="prefix"]').val(),
            suffix: html.find('[name="suffix"]').val(),
            img: html.find('[name="img"]').val(),
          };
        } else if (mainOption === "replace") {
          stageSettings = {
            action: replace,
            replacementItem: html.find('[name="replacementItem"]').val(),
          };
        } else if (mainOption === "remove") {
          stageSettings = {
            action: remove
          };
        };

        // Get notification settings
        const decayMessage = html.find('[name="message"]')
        const consoleChecked = html.find('[name="console"]').prop('checked');
        const chatChecked = html.find('[name="chat"]').prop('checked');
        const uiChecked = html.find('[name="ui"]').prop('checked');

        // Include the checkbox values in the stageSettings
        stageSettings.message = decayMessage;
        stageSettings.console = consoleChecked;
        stageSettings.chat = chatChecked;
        stageSettings.ui = uiChecked;

        // Set the settings.stages[stageInt] properties
        console.log("Setting properties")
        settings.stages[stageInt] = stageSettings;

        // Do something with the selected options
        console.log("Main Option:", mainOption);
        console.log("Settings:", stageSettings);

        // Close the dialog
        dialog.close();
        },
      },
      cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: `Cancel`,
      },
    },
    default: 'apply',
  }).render(true);
};

// Function to open a help dialog for all sections
function openHelpDialog() {
  const helpDialog = new Dialog({
    title: "Expiry Item Configuration Help",
    content: `
    <form class="form-horizontal">
        <fieldset>
        <legend>Stage Basics</legend>
        <p>Item lifecycles in Expiry are composed of <b>stages</b> which are progressed through as the game time changes. The lifecycle of an Expiry item may contain up to 3 distinct stages, and each stage may be configured for one action from the list below:</p>
        <ul>
            <li><b>Revise:</b> change the name or image of the item</li>
            <li><b>Replace:</b> replace the item with another item</li>
            <li><b>Remove:</b> remove the item from the player's inventory</li>
        </ul>
        <p>An Expiry lifecycle may mix and match these actions. For instance:</p>
        <ul>
            <li><b>Stage 1:</b> Rename item from 'Banana' to 'Brown Banana' (<i>revise</i>)</li>
            <li><b>Stage 1 (alt):</b> Replace item 'Brown Banana' with item 'Rotten Banana,' which you have configured with a status effect to take place when eaten (<i>replace</i>)</li>
            <li><b>Stage 2</b>: Remove the item entirely as it rots to nothing (<i>remove</i>)</li>
        </ul>
        <p>Any stages that are left unconfigured will have no effect on the item; e.g. if the final configured stage changes the name to 'Rotten Banana' and no further action is taken, the item will persist in that state going forward.</p>
        </fieldset>
        
        <fieldset>
        <legend>Stage Decay Rate</legend>
        <p>Stages all follow the same decay rate, set in the main item configuration window. If an item is set to a 12 hour decay rate:</p>
        <ul>
            <li>12 hours <b>after an instance of the item is added to an actor's inventory</b> the 1st decay stage will execute</li>
            <li>24 hours later the 2nd action will execute</li>
            <li>36 hours the 3rd action will execute</li>
        </ul>
        </fieldset>

        <fieldset>
        <legend>Reversing Time</legend>
        <p>In its default configuration, Expiry can handle time shifts in reverse as well; that is, in a situation where the GM moves the game clock to an earlier time, decay stages will be reversed.</p>
        <p>This is due to the fact that Expiry lifespans are calculated to a distinct game time, not a relative one. If you add an item to a character's inventory with a 12 hour expiration, then reset the clock to 100 years earlier, it will take 100 years and 12 hours for the item to expire.</p>
        <p>This behavior may be disabled in the module's configuration.</p>
        <p><i>(Note: items that have a <b>remove</b> stage which has already taken place will not reappear)</i></p>
        </fieldset>
        
        <fieldset>
        <legend>Unlimited Variation</legend>
        <p>Individual item stages are limited to a maximum of three, but using the <b>Replace action</b> you may replace the original Expiry-configured item with another Expiry-configured item that has its own distinct configuration. By 'looping' items this way you can get as detailed as you desire.</p>
        </fieldset>
        
        <!-- Add more sections as needed -->
    </form>
    `,
    buttons: {
    okay: {
        icon: "<i class='fas fa-check'></i>",
        label: "Okay",
        callback: async () => {
        helpDialog.close(); // Close the help dialog when "Okay" is clicked
        },
    },
    },
    default: 'okay',
  }).render(true);
};