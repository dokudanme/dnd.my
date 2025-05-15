document.addEventListener("DOMContentLoaded", function() {
  console.log("Modified calculator loaded and DOM is ready.");
  
  // Define total available points (you can adjust this as needed)
  window.totalPoints = 39;

  // Modified cost function for score range 6 to 16.
  window.calcCost = function(score) {
    score = parseInt(score);
    if (score <= 13) {
      // For scores 6 through 13, cost = score - 6
      return score - 6;
    } else if (score <= 15) {
      // For scores 14 through 15, cost = 2 * score - 19
      return 2 * score - 19;
    } else { // score == 16
      // The jump from 15 to 16 costs 5 points: cost(16) = cost(15) + 5 = 11 + 5 = 16.
      return 16;
    }
  };

  // Sum the cost across all abilities.
  window.getTotalCost = function() {
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    let total = 0;
    abilities.forEach(function(stat) {
      const value = parseInt(document.getElementById(stat).textContent);
      total += window.calcCost(value);
    });
    return total;
  };

  // Update the remaining points display and disable/enable buttons.
  window.recalc = function() {
    const totalCost = window.getTotalCost();
    const remainingPoints = window.totalPoints - totalCost;
    const remainingDiv = document.getElementById('remaining');

    if (remainingPoints < 0) {
      remainingDiv.innerHTML = `<span class="over-budget">Over budget by ${-remainingPoints} point(s)!</span>`;
    } else {
      remainingDiv.textContent = 'Осталось очков: ' + remainingPoints;
    }

    window.updateButtonStates();
  };

  // Update the state of plus and minus buttons based on the current stat value.
  window.updateButtonStates = function() {
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const remaining = window.totalPoints - window.getTotalCost();

    abilities.forEach(function(stat) {
      const currentValue = parseInt(document.getElementById(stat).textContent);
      // Disable the minus button if at the lower bound of 6.
      document.getElementById(stat + '-minus').disabled = (currentValue <= 6);

      // Disable the plus button if at the upper bound of 16,
      // or if not enough points remain for the next increase.
      if (currentValue >= 16) {
        document.getElementById(stat + '-plus').disabled = true;
      } else {
        const additionalCost = window.calcCost(currentValue + 1) - window.calcCost(currentValue);
        document.getElementById(stat + '-plus').disabled = (remaining < additionalCost);
      }
    });
  };

  window.calculateModifier = function(statValue) {
    return Math.floor((statValue - 10) / 2); // Modifier formula
  };
  
  window.updateModifiers = function() {
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  
    abilities.forEach(stat => {
      const statValue = parseInt(document.getElementById(stat).textContent);
      const modifierValue = window.calculateModifier(statValue);
      document.getElementById('mod-' + stat).textContent = (modifierValue >= 0 ? '+' : '') + modifierValue;
    });
  };

  
  
  // Increase the stat value if possible.
  window.increment = function(stat) {
    const span = document.getElementById(stat);
    let currentValue = parseInt(span.textContent);
    if (currentValue < 16) {  // Allow increases until 16
      const additionalCost = window.calcCost(currentValue + 1) - window.calcCost(currentValue);
      if (window.totalPoints - window.getTotalCost() >= additionalCost) {
        span.textContent = currentValue + 1;
        window.updateModifiers(); // Update modifiers after stat change
      } else {
        alert("Not enough points remaining for that increase!");
      }
    }
    window.recalc();
  };

  // Decrease the stat value if possible.
  window.decrement = function(stat) {
    const span = document.getElementById(stat);
    let currentValue = parseInt(span.textContent);
    if (currentValue > 6) {  // Allow decreases only down to 6
      span.textContent = currentValue - 1;
      window.updateModifiers(); // Update modifiers after stat change
    }
    window.recalc();
  };
  
  window.resetStats = function() {
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  
    abilities.forEach(stat => {
      document.getElementById(stat).textContent = "6"; // Set each stat to default 6
    });
  window.updateModifiers(); // Reset modifiers as well
  window.recalc(); // Recalculate remaining points
  };

  // Initial calculation on page load.
  window.recalc();
  // Call updateModifiers when the page loads
  window.updateModifiers(); 
});
