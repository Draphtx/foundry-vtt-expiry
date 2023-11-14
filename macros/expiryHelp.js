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
              <li><b>Stage 2:</b> Replace item 'Brown Banana' with item 'Rotten Banana,' which you have configured with a status effect to take place when eaten (<i>replace</i>)</li>
              <li><b>Stage 3</b>: Remove the item entirely as it rots to nothing (<i>remove</i>)</li>
            </ul>
            <p>Any stages that are left unconfigured will have no effect on the item; e.g. if the final configured stage changes the name to 'Rotten Banana' and no further action is taken, the item will persist in that state going forward.</p>
          </fieldset>
          
          <fieldset>
            <legend>Stage Decay Rate</legend>
            <p>Stages all follow the same decay rate, set in the main item configuration window. If an item is set to a 12 hour decay rate:</p>
            <ul>
              <li>12 hours after the <b>item is added to an actor's inventory</b> the 1st decay stage will execute</li>
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
            <p>Individual item stages are limited to a maximum of three, but using the <b>Replace action</b> you may replace the original Expiry-configured item with another Expiry-configured item that has its own distinct configuration. By 'looping' items this way you may achieve infinite variation.</p>
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
  }
  
  // Example usage to open the help dialog
  openHelpDialog();