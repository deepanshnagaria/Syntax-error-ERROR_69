$(".btn-danger").on("click",function(){
	$("."+this.value).addClass("no");
	var id=this.value;
	$("#removed").val($("#removed").val()+","+id);
});
$(".addmore").on("click",function(){
	$("#sub").before($("#repeat").html());
});
