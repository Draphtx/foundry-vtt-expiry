let settings = {
  stages: {
      1: null,
      2: null,
      3: null
  },
};
let stayOpen = false; // Custom flag to control parent dialog closing

// Create the parent dialog
const parentDialog = new Dialog({
title: "Expiry Item Configuration",
content: `<style>
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
  stage3: {
    icon: "<i class='fas fa-cog'></i>",
    label: "Configure Stage 3",
    callback: async () => {
      stayOpen = true; // Set the flag to keep the parent dialog open
      openChildDialog(3);
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
  Reset: {
    icon: "<i class='fas fa-undo'></i>",
    label: "Reset",
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
closeOnSubmit: false, // Prevent the parent dialog from closing on submission
default: 'apply',
}, {id: "savingThrowSelector"}).render(true);


// Function to open a child dialog
// Function to open a child dialog
function openChildDialog(stageInt) {
const dialog = new Dialog({
  title: `Expiry Stage ${stageInt} Settings`,
  content: `
    <form id="expiry-options-form">
      <div class="form-group">
        <label>Main Option:</label>
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
            prefix: html.find('[name="prefix"]').val(),
            suffix: html.find('[name="suffix"]').val(),
            img: html.find('[name="img"]').val(),
          };
        } else if (mainOption === "replace") {
          stageSettings = {
            replacementItem: html.find('[name="replacementItem"]').val(),
          };
        } else if (mainOption === "remove") {
          stageSettings = {
            remove: true,
          };
        }

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
}