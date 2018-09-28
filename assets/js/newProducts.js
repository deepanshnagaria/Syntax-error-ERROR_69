$("#addsub").on("click",function(){
	$("#addsub").before($("#sub").html());
});
$("#addsubsub").on("click",function(){
	$("#addsubsub").before('<div class="form-group" ><label for="category2" >Sub-SubCategories:</label><input type="text" class="form-control" id="category2" aria-describedby="emailHelp" placeholder="Name" name="subsubcategory[]" ></div><span id="fo"><div class="form-group"><div class="row"><div class="col"><label for="feature">Feature</label><input type="text" class="form-control" id="title" placeholder="feature" name="feature[]" ></div><div class="col"><label for="answer1">Description</label><input type="text" class="form-control" id="answer1" placeholder="description" name="answer[]" ><p>Different options should be seperated by commas. Eg:colour(feature) => black,white(description)</p></div></div></div></span><a href="#" class="thisone"><small id="emailHelp" class="form-text white">Add feature...</small></a><div class="form-group blank" ><label for="category5" >Number</label><input type="number" class="form-control" id="category5" aria-describedby="emailHelp" placeholder="Name" name="num[]" value="1" ></div>'
)});
$("#subsub").on("click",".thisone",function(){
	$(".thisone").before($("#fo").html());
	$("#category5").val(parseInt($("#category5").val())+1);
});