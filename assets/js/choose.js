$("#categorySelected").on('change',function(){
	$(".subcategorySelected").hide()
	$("."+this.value).show()
})