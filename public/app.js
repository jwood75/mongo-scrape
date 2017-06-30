//using mongoose route to retrieve articels
$.getJSON("/articles", function(data){

	for(var i =0; i < data.length; i++){

		$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
	}
});

//scrapping new york times when button is clicked
$(document).on("click", "#scrape", function(){

	$.get("/scrape");

	window.location.reload();
});

//when clicking on <p> tag will display notes associated with article
$(document).on("click", "p", function(){

	$("#notes").empty();

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/articles/" + thisId
	}).done(function(data){
		console.log(data);

		$("#notes").append("<h2>" + data.title + "</h2>");
		$("#notes").append("<input id='titleinput' name='title' >");
		$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
		$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

		if (data.note){
			// $("#titleinput").val(data.note.title);
			// $("#bodyinput").val(data.note.body);
			$("#notes").append("<h3>" + data.note.title + "</h3>");
			$("#notes").append("<p>" + data.note.body + "</p>");
		}
	});

});

//clicking save note button will save the note to the database
$(document).on("click", "#savenote", function(){

	var thisId = $(this).attr("data-id");

	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			title: $("#titleinput").val(),
			body: $("#bodyinput").val()
		}
	}).done(function(data){
		console.log(data);
		$("#notes").empty();
	});
	$("#titleinput").val("");
	$("#bodyinput").val("");
});