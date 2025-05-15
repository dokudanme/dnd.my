// calculator.js
document.addEventListener("DOMContentLoaded", function() {
  console.log("calculator.js loaded and DOM is ready.");
  
  window.totalPoints = 27;

  // Calculate cost for a given ability score.
  // For scores 8 to 13, cost = score - 8.
  // For scores 14 and 15, cost = 2 * score - 21.
  window.calcCost = function(score) {
    score = parseInt(score);
    if (score <= 13) {
      return score - 8;
    } else {
      return 2 * score - 21;
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

  // Update the remaining points display and button states.
  window.recalc = function() {
    const totalCost = window.getTotalCost();
    const remainingPoints = window.totalPoints - totalCost;
    const remainingDiv = document.getElementById('remaining');
    
    if (remainingPoints < 0) {
      remainingDiv.innerHTML = `<span class="over-budget">Over budget by ${-remainingPoints} point(s)!</span>`;
    } else {
      remainingDiv.textContent = 'Remaining Points: ' + remainingPoints;
    }
    
    window.updateButtonStates();
  };

  // Enable/disable plus and minus buttons based on the current stats and remaining points.
  window.updateButtonStates = function() {
    const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const remaining = window.totalPoints - window.getTotalCost();

    abilities.forEach(function(stat) {
      const currentValue = parseInt(document.getElementById(stat).textContent);
      // Disable the minus button if at minimum.
      document.getElementById(stat + '-minus').disabled = (currentValue <= 8);
      
      // Disable the plus button if at maximum or if not enough points remain.
      if (currentValue >= 15) {
        document.getElementById(stat + '-plus').disabled = true;
      } else {
        const additionalCost = window.calcCost(currentValue + 1) - window.calcCost(currentValue);
        document.getElementById(stat + '-plus').disabled = (remaining < additionalCost);
      }
    });
  };

  // Increase the stat value by 1 if possible.
  window.increment = function(stat) {
    const span = document.getElementById(stat);
    let currentValue = parseInt(span.textContent);
    if (currentValue < 15) {
      const additionalCost = window.calcCost(currentValue + 1) - window.calcCost(currentValue);
      if (window.totalPoints - window.getTotalCost() >= additionalCost) {
        span.textContent = currentValue + 1;
      } else {
        alert("Not enough points remaining for that increase!");
      }
    }
    window.recalc();
  };

  // Decrease the stat value by 1 if possible.
  window.decrement = function(stat) {
    const span = document.getElementById(stat);
    let currentValue = parseInt(span.textContent);
    if (currentValue > 8) {
      span.textContent = currentValue - 1;
    }
    window.recalc();
  };

  // Initial calculation.
  window.recalc();
});

