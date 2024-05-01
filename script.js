console.log("code connected");

$("#back-dq").click(function () {
  $("#dq").hide();
});

var disqualifier;
let currentIndex = 0;
const formSteps = document.querySelectorAll(".form-step");
const formNav = $(".form-navigation");
const barOne = $(".progress-bar-inner.one");
const barTwo = $(".progress-bar-inner.two");
const barThree = $(".progress-bar-inner.three");
const markerOne = $(".progress-marker.one");
const markerTwo = $(".progress-marker.two");
const markerThree = $(".progress-marker.three");

function updateProgressBars(currentIndex) {
  const totalSteps = 10; // Update this value with the total number of steps in your form

  const progressOne = Math.min((currentIndex / totalSteps) * 100, 33);
  const progressTwo = Math.min(
    ((currentIndex - 3) / (totalSteps - 3)) * 100,
    33,
  );
  const progressThree = Math.min(
    ((currentIndex - 8) / (totalSteps - 8)) * 100,
    34,
  );

  gsap.to(".progress-bar-inner.one", {
    width: progressOne + "%",
    duration: 0.75,
  });
  gsap.to(".progress-bar-inner.two", {
    width: progressTwo + "%",
    duration: 0.75,
  });
  gsap.to(".progress-bar-inner.three", {
    width: progressThree + "%",
    duration: 0.75,
  });
}

function transitionToStep(nextIndex) {
  const currentStep = formSteps[currentIndex];
  const nextStep = formSteps[nextIndex];

  // Check if the current form step has the combo class 'w-nav'
  const hasWNavClass = nextStep.classList.contains("nav");
  console.log(hasWNavClass);
  gsap.to(currentStep, {
    opacity: 0,
    duration: 0.25,
    delay: 0.4,
    onComplete: () => {
      currentStep.style.display = "none";
      gsap.to(nextStep, { opacity: 1, duration: 0.75 });
      nextStep.style.display = "block";
      currentIndex = nextIndex;
      if (hasWNavClass) {
        formNav.show();
        gsap.to(formNav, { opacity: 1, duration: 0.75 });
      } else {
        gsap.to(formNav, { opacity: 0, duration: 0.75 });
        formNav.hide();
      }
    },
  });
  if (currentStep.classList.contains("check-bmi")) {
    checkBMI();
    console.log("BMI class included");
  }
  if (currentStep.classList.contains("check-age")) {
    checkAge();
    console.log("Check age class included");
  }
  if (currentStep.classList.contains("check-medical")) {
    checkMedical(currentStep);
  }
  if (currentStep.classList.contains("last-goal")) {
    $("#graph-sub").show();
    gsap.to("#graph-sub", { opacity: 1, duration: 0.75 });
  }
  if (currentStep.classList.contains("insurance-next")) {
    $("#insurance-sub").show();
    gsap.to("#insurance-sub", { opacity: 1, duration: 0.75 });
  }
  updateProgressBars(nextIndex);
  $("#current-step").text(nextIndex);
}

$("#goals-next").click(function () {
  gsap.to("#graph-sub", { opacity: 0, duration: 0.75 });
  $("#med-sub").show();
  $("#graph-sub").hide();
  gsap.to("#med-sub", { opacity: 1, duration: 0.75 });
});
$("#med-next").click(function () {
  gsap.to("#med-sub", { opacity: 0, duration: 0.75 });
  $("#med-sub").hide();
});
$("#insurance-next").click(function () {
  gsap.to("#insurance-sub", { opacity: 0, duration: 0.75 });
  $("#insurance-sub").hide();
});

function validateStep(stepIndex) {
  const inputFields = formSteps[stepIndex].querySelectorAll(".form-field");
  let isValid = true;

  inputFields.forEach((field) => {
    console.log(field.value);
    // Check if the field is a select dropdown
    if (field.tagName === "SELECT") {
      // Check if the selected option value is not empty
      if (field.value.length < 1) {
        // If the selected option value is empty, show an alert
        alert(
          "Select an option from the dropdown before moving to the next step.",
        );
        // Set isValid to false since there's an empty dropdown
        isValid = false;
      }
    } else {
      // For other field types, check if the value is not null and its length is greater than 0
      if (field.value !== null && field.value.trim().length === 0) {
        // If the field value is empty, show an alert
        alert("Fill in the required field before moving to the next step.");
        // Set isValid to false since there's an empty field
        isValid = false;
      }
    }
  });

  return isValid;
}

function nextStep() {
  if (validateStep(currentIndex)) {
    if (currentIndex < formSteps.length - 1) {
      transitionToStep(currentIndex + 1);
    }
  }
}

function prevStep() {
  if (currentIndex > 0) {
    transitionToStep(currentIndex - 1);
  }
}

$(".nav-btn.next").click(nextStep);
$(".nav-btn.back").click(prevStep);
$("input[type='radio']").click(nextStep);

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

// Loop through each state and append as an option to the dropdown
$(document).ready(function () {
  const dropdown = $("#states");
  usStates.forEach(function (state) {
    dropdown.append($("<option></option>").text(state));
  });
});

function checkBMI() {
  // Additional logic for BMI calculation and showing/hiding elements
  const weight = parseFloat($("#current-weight").val());
  const feet = parseFloat($("#height").val());
  const inches = parseFloat($("#height-inches").val());
  const heightInInches = feet * 12 + inches;
  const bmi = (weight / (heightInInches * heightInInches)) * 703;
  if (bmi < 26.9) {
    $("#dq").show();
    disqualifier = "your BMI of" + " " + Math.floor(bmi);
    $("#dq-reason").text(disqualifier);
  } else {
    $("#dq").hide();
  }
}

function checkAge() {
  // Get the value of the selected option from the radio group
  const ageOption = $("input[name='Age']:checked").val();
  console.log("Selected age option:", ageOption);

  // Add conditional logic based on the selected age
  if (ageOption === "Under 18") {
    $("#dq").show(); // Show the element with ID 'dq'
    disqualifier = "your age (must be 18+)";
    $("#dq-reason").text(disqualifier);
  } else {
    $("#dq").hide(); // Hide the element with ID 'dq'
  }
}

function checkMedical(currentStep) {
  // Get all checkboxes within the step
  const checkboxes = $(currentStep).find("input[type='checkbox']");

  // Iterate over each checkbox (excluding the first one)
  for (let i = 1; i < checkboxes.length; i++) {
    if ($(checkboxes[i]).is(":checked")) {
      $("#dq").show(); // Show the element with ID 'dq'
      disqualifier = "your medical condition(s)";
      $("#dq-reason").text(disqualifier);
      return; // Exit function if any checkbox is checked (except the first one)
    }
  }

  // Hide the element with ID 'dq' if no checkbox (except the first one) is checked
  $("#dq").hide();
}

function updateProgressBars(currentIndex) {
  const totalSteps = 24;
  const totalOne = totalSteps - 7;
  const totalTwo = totalSteps - 9;
  const totalThree = totalSteps - 7;
  var progressOne;
  var progressTwo;
  var progressThree;

  if (currentIndex < 7) {
    progressOne = Math.min((currentIndex / (totalSteps - totalOne)) * 100);
  } else {
    progressOne = 110;
  }

  if (currentIndex > 7) {
    progressTwo = Math.min((currentIndex / (totalSteps - 9)) * 100);
  } else if (currentIndex < 7) {
    progressTwo = 0;
  } else if (currentIndex > 16) {
    progressTwo = 110;
  }
  if (currentIndex >= 16) {
    progressThree = Math.min((currentIndex / totalSteps) * 100);
  } else if (currentIndex < 16) {
    progressThree = 0;
  } else if (currentIndex >= 21) {
    progressThree = 100;
  }

  gsap.to(".progress-bar-inner.one", {
    width: progressOne + "%",
    duration: 0.75,
  });
  gsap.to(".progress-bar-inner.two", {
    width: progressTwo + "%",
    duration: 0.75,
  });
  gsap.to(".progress-bar-inner.three", {
    width: progressThree + "%",
    duration: 0.75,
  });

  console.log(progressOne, progressTwo, progressThree);

  if (progressOne >= 100) {
    gsap.to(".progress-bar-inner.one", {
      backgroundColor: "#e4166d",
      duration: 0.75,
    });
    gsap.to(".progress-marker.one", {
      backgroundColor: "#ffa6cb",
      duration: 0.75,
    });
    gsap.to(".progress-label.two", {
      color: "#e4166d",
      duration: 0.75,
    });
    gsap.to(".progress-check.one", {
      opacity: 1,
      duration: 0.75,
    });
  } else if (progressOne < 100) {
    gsap.to(".progress-bar-inner.one", {
      backgroundColor: "#ffa6cb",
      duration: 0.75,
    });
    gsap.to(".progress-marker.one", {
      backgroundColor: "#d2d2d2",
      duration: 0.75,
    });
    gsap.to(".progress-label.two", {
      color: "#d2d2d2",
      duration: 0.75,
    });
    gsap.to(".progress-check.one", {
      opacity: 0,
      duration: 0.75,
    });
  }
  if (progressTwo >= 100) {
    gsap.to(".progress-bar-inner.two", {
      backgroundColor: "#e4166d",
      duration: 0.75,
    });
    gsap.to(".progress-label.three", {
      color: "#e4166d",
      duration: 0.75,
    });
    gsap.to(".progress-marker.two", {
      backgroundColor: "#ffa6cb",
      duration: 0.75,
    });
    gsap.to(".progress-check.two", {
      opacity: 1,
      duration: 0.75,
    });
  } else if (progressTwo < 100) {
    gsap.to(".progress-bar-inner.two", {
      backgroundColor: "#ffa6cb",
      duration: 0.75,
    });
    gsap.to(".progress-label.three", {
      color: "#d2d2d2",
      duration: 0.75,
    });
    gsap.to(".progress-marker.two", {
      backgroundColor: "#d2d2d2",
      duration: 0.75,
    });
    gsap.to(".progress-check.two", {
      opacity: 0,
      duration: 0.75,
    });
  }
}
$(document).ready(function () {
  $("#height").on("input", function () {
    const value = $(this).val();
    $("#height-display").text(value);
  });
});

$(document).ready(function () {
  $("#height-inches").on("input", function () {
    const value = $(this).val();
    $("#height-inch-display").text(value);
  });
});