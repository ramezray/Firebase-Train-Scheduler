$(document).ready(function () {
    // Initialize Firebase!!
    var config = {
        apiKey: "AIzaSyDaoutlOd933Jcvk3QpsQnUrJH-BUQ7vjs",
        authDomain: "train-scheduler-byray.firebaseapp.com",
        databaseURL: "https://train-scheduler-byray.firebaseio.com",
        projectId: "train-scheduler-byray",
        storageBucket: "train-scheduler-byray.appspot.com",
        messagingSenderId: "854338813760"
    };
    //firebase config
    firebase.initializeApp(config);
    var dataRef = firebase.database();
//act when click submit
    $("#SubmitButton").on("click", function () {
        //user inputs
        var trainName = $("#trainName").val().trim();
        var destination = $("#destination").val().trim();
        var firstTrain = moment($("#firstTrainTime").val().trim(), "HH:mm").format("HH:mm");
        var frequency = $("#frequency").val().trim();
        // store all data the need to push
        var newTrain = {
            trainName: trainName,
            destination: destination,
            firstTrain: firstTrain,
            frequency: frequency
        }
        // uploads new train data to the database
        dataRef.ref().push(newTrain);
        // keeps input box clear
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrainTime").val("");
        $("#frequency").val("");
    });
    //  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
    dataRef.ref().on("child_added", function (childSnapshot) {
        // childSnapshot values into a variable
        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTrain;
        var frequency = childSnapshot.val().frequency;
        // first Train pushed back to make sure it comes before current time
        var firstTimeConverted = moment(firstTrain, "HH:mm");
        var currentTime = moment().format("HH:mm");
        // store difference between currentTime and fisrt train converted in a variable.
        var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
        // find Remainder of the time left and store in a variable
        var timeRemainder = timeDiff % frequency;
        // to calculate minutes till train,we store it in a variable
        var minutesAway = frequency - timeRemainder;
        // next train
        var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
        //creating HTML 
        $("#tbody").append(
            "<tr><td>" + (trainName) +
            "</td><td>" + (destination) +
            "</td><td>" + (frequency) +
            "</td><td>" + (nextArrival) +
            "</td><td>" + (minutesAway) +
            "</td></tr>");
    });
});