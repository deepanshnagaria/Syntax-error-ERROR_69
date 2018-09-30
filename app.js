var e= require("express"),bodyparser=require("body-parser"),mongoose=require("mongoose"),methodOverride=require("method-override");
var app=e();
Schema=mongoose.Schema;
var passport= require("passport"),LocalStrategy= require("passport-local"),passportLocalMongoose= require("passport-local-mongoose");
var User= require("./models/user");
var async = require("async");

mongoose.connect("mongodb://Deepansh:Ketan15@ds139970.mlab.com:39970/deepansh", { useNewUrlParser: true });
app.set("view engine","ejs");
app.use(e.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(methodOverride("_method"));

app.use(e.static('assets'));

app.use(require("express-session")({
	secret: "I,Deepansh Nagaria am the best developer in IIT Roorkee and I made this site for ARIES IITR",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));


/*******************************************************************************************************/
//								Databases
//								 Schemas
/*******************************************************************************************************/
var paymentSchema=new mongoose.Schema({
	accountID:String,
	mode:String,
	accountSecret:String,
	localRate:Number,
	townRate:Number,
	stateBased:Number,
	countryBased:Number,
	internationalBased:Number
})
var Payment=mongoose.model("Payment",paymentSchema);

var productSchema=new mongoose.Schema({
	name:String,
	category:String,
	subcategory:String,
	subsubcategory:String,
	image:String,
	price:Number,
	feature:[{type:String}],
	value:[{type:String}]
})
var Product=mongoose.model("Product",productSchema);
/*Product.create({
	name:"Acer Nito 5",
	category:"Electronics",
	subcategory:"Laptops",
	subsubcategory:"Gaming",
	image:"https://images-na.ssl-images-amazon.com/images/I/41zDsd2AuqL.jpg",
	price:89999,
	feature:["RAM","Graphic card","ROM","Display","SSD"],
	value:["16 GB","Nvidia 1050 Ti","1 TB", "1080px","128 GB"]
})*/

var complaintSchema=new mongoose.Schema({
	user:String,
	description:String,
	date:{
		type:Date,
		default: Date.now
	}
});
var Complaint=mongoose.model("Complaint",complaintSchema);

var featureSchema=new mongoose.Schema({
	name:String,
	options:[{type:String}],
	selected:String
})
var Feature=mongoose.model("Feature",featureSchema);
/*var Feature1=mongoose.model("Feature",featureSchema);*/


var subSubCategorySchema=new mongoose.Schema({
	name:String,
	features:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Feature"
	}]
});
var SubSubCategory=mongoose.model("SubSubCategory",subSubCategorySchema);
/*var SubSubCategory1=mongoose.model("SubSubCategory",subSubCategorySchema);*/



var subCategorySchema=new mongoose.Schema({
	name:String,
	subCategories:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"SubSubCategory"
		}
	]
});
var SubCategory=mongoose.model("SubCategory",subCategorySchema);
/*var SubCategory1=mongoose.model("SubCategory",subCategorySchema);*/

var smtp=new mongoose.Schema({
	mail:String,
	key:String,
	secret:String
});
var SMTP=mongoose.model("SMTP",smtp);

var categorySchema=new mongoose.Schema({
	name:String,
	subCategories:[
		{
			type:mongoose.Schema.Types.ObjectId,
			ref:"SubCategory"
		}
	]
});
var Category=mongoose.model("Category",categorySchema);
/*var Product=mongoose.model("Category",categorySchema);
var Service=mongoose.model("Category",categorySchema);*/

var requestSchema=new mongoose.Schema({
	category:String,
	subCategory:String,
	subSubCategory:String,
	features:String,
	options:[{type:String}],
	description:String,
	user:String
})
var Request=mongoose.model("Request",requestSchema);

/*Request.create({
	category:"Electrcian",
	subCategory:"Power-Supply",
	subSubCategory:"Repairs",
	features:"Fuses",
	options:["1","2"],
	description:"Repairing of main power supply",
	user:"Deepansh"
})*/
/*Complaint.create({
	user:"Deepansh",
	description:"It is hardcoded."
});*/

/*SMTP.create({
	mail:"deepanshnagaria@gmail.com",
	key:"iDontKnow",
	secret:"noIdea"
});*/

/*Category.create({
	name:"Toys"
});


SubCategory.create({
	name:"Plastic"
},function(err,subCategory){
	Category.findOne({name:"Toys"},function(err,found){
		found.subCategories.push(subCategory);
		found.save(function(err,saved){});
	})
});


SubSubCategory.create({
	name:"Age-group-2-5"
},function(err,subSubCategory){
	SubCategory.findOne({name:"Plastic"},function(err,found){
		found.subCategories.push(subSubCategory);
		found.save(function(err,saved){});
	})
});

Feature.create({
	name:"Company",
	options:["OK","Tin-Tin","Disney","Others"]
},function(err,feature){
	SubSubCategory.findOne({name:"Age-group-2-5"},function(err,found){
		found.features.push(feature);
		found.save(function(err,saved){});
	})
});*/
/********************************************************************************************/
//									Routes
//									basic
/*Payment.create({
	accountID:"",
	accountSecret:"Deepansh",
	mode:"visa",
	localRate:2,
	townRate:3,
	stateBased:4,
	countryBased:7,
	internationalBased:10
});*/

app.get("/rootadmin",function(req,res){
	res.render("rootadmin");
});

/*app.get("/spareroom",function(req,res){
	res.render("spareroom");
});*/

app.get("/buyer",function(req,res){
	res.render("buy");
});

app.get("/buyer/buy",function(req,res){
	Category.find({}).populate("subCategories").exec(function(err,categories){
		res.render("choose",{categories:categories});
	})
})

app.post("/buyer/products",function(req,res){
	Category.findById(req.body.category,function(err,category){
		console.log(req.body);
		Product.find({category:category.name,subcategory:req.body.subcategory},function(err,products){
			console.log(products);
			res.render("products",{products:products});
		})
	})
})

app.get("/coming_soon",function(req,res){
	res.render("coming_soon");
})

app.get("/buyer/complaint",function(req,res){
	res.render("complaint");
})

app.post("/buyer/complaint",function(req,res){
	Complaint.create({
		user:req.body.name,
		description:req.body.description
	},function(err,complaint){
		res.render("thanks");
	})
});

app.get("/seller",function(req,res){
	res.render("sell");
});

app.get("/seller/sell",function(req,res){
	Category.find({}).populate("subCategories").exec(function(err,categories){
		res.render("sellproduct",{categories:categories});
	})
	
});

app.post("/step2",function(req,res){
	Category.findById(req.body.category,function(err,category){
		SubCategory.findById(req.body.subcategory).populate("subCategories").exec(function(err,sub){
			res.render("step2",{sub:sub,category:category});
		})
	})
})

app.post("/step3",function(req,res){
	SubSubCategory.findById(req.body.subsub).populate("features").exec(function(err,subsub){
		res.render("step3",{c:req.body.category,s:req.body.subcategory,subsub:subsub});
	})
})

app.post("/new",function(req,res){
	SubSubCategory.findById(req.body._id).populate("features").exec(function(err,subsub){
		var f=[];
		for(var i=0;i<subsub.features.length;i++){
			f.push(subsub.features[i].name);
		}
		Product.create({
		name:req.body.name,
		category:req.body.category,
		subcategory:req.body.subcategory,
		subsubcategory:req.body.subsubcategory,
		image:req.body.image,
		price:req.body.price,
		feature:f,
		value:req.body.option
	},function(e,d){
		res.redirect("/done");
	});
	});

})

app.get("/done",function(req,res){
	res.render("done");
})

app.get("/seller/request",function(req,res){
	res.render("requestProduct");
})

app.post("/seller/request",function(req,res){
	Request.create({
		category:req.body.category,
		subCategory:req.body.subcategory,
		subSubCategory:req.body.subsubcategory,
		features:req.body.feature,
		options:req.body.answer,
		description:req.body.description,
		user:req.body.name
	},function(req,res){
		res.render("/sellerthanks");
	})
})

app.get("/seller/complaint",function(req,res){
	res.render("sellercomplaints");
})

app.post("/seller/complaint",function(req,res){
	Complaint.create({
		user:req.body.name,
		description:req.body.description
	},function(err,complaint){
		res.render("sellerthanks");
	})
});

app.get("/",function(req,res){
	/*res.render("basic");*/
	res.render("basic");
});

app.get("/payment",function(req,res){
	Payment.findOne({},function(err,payment){
		res.render("payments",{payment:payment});
	})
});

app.get("/smtp",function(req,res){
	SMTP.findOne({},function(err,smtp){
		res.render("smtp",{smtp:smtp});
	})
})

app.put("/rates/:_id/edit",function(req,res){
	Payment.findByIdAndUpdate(req.params._id,req.body.payment,function(err,f){
		res.redirect("/root");
	})
})

app.put("/smtp/:_id/edit",function(req,res){
	SMTP.findByIdAndUpdate(req.params._id,req.body.smtp,function(err,f){
		res.redirect("/root");
	})
})
/*--------------------------------------------------------------------------*/
/*                      CATEGORY RELATED                                    */
/*--------------------------------------------------------------------------*/
app.get("/categories",function(req,res){
	Category.find({},function(err,categories){
		if(!err){
			res.render("categories",{categories:categories});
		}
	})
});

app.get("/categories/new",function(req,res){
	res.render("newCategory");
});

/*app.get("/spareroom/categories",function(req,res){
	Category.find({},function(err,categories){
		if(!err){
			res.render("categories",{categories:categories});
		}
	})
});

app.get("/spareroom/categories/new",function(req,res){
	res.render("newCategory");
})*/

app.post("/newCategory",function(req,res){
	Category.create({
		name:req.body.category
	},function(err,category){
		res.redirect("/categories/"+category._id+"/edit");
	});

})

app.get("/categories/:_id/edit",function(req,res){
	Category.findById(req.params._id).populate("subCategories").exec(function(err,category){
		SubCategory.find({},function(err,subCategories){
			res.render("editCategory",{category:category,subCategories:subCategories});
		})
	})
});
app.put("/categories/:_id/edit",function(req,res){
	var a1,b1;
	Category.findById(req.params._id,function(err,category){
		var a,b;
		b=[];
		a=category.subCategories;
		
		var removed=req.body.removed.split(",");
		for(var i=0;i<a.length;i++)
		{
			var flag=0;
			for(var j=0;j<removed.length;j++){
				if(a[i]==removed[j])
					flag=1;
			}
			if(flag==0){
				b.push(a[i]);
			}
		}
		
		for(var i=0;i<req.body.subCategory.length;i++)
		{
			if(req.body.subCategory[i]!="none")
				b.push(req.body.subCategory[i]);
		}
		
		if(category.name==req.body.name&&category.subCategories==b){
			res.redirect("/categories");
		}
		
		Category.create({
			name:req.body.name,
			subCategories:b
		},function(err,category1){});
	})
	Category.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/categories");
	})
})

app.get("/categories/:_id/delete",function(req,res){
	Category.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/categories");
	})
});

/*-------------------------------------------------------*/
/*----------------SUBCATEGORY REALTED---------------------*/
/*---------------------------------------------------------*/
app.get("/subCategories",function(req,res){
	SubCategory.find({},function(err,subCategories){
		if(!err){
			res.render("subCategories",{subCategories:subCategories});
		}
	})
});

app.get("/subCategories/new",function(req,res){
	res.render("newSubCategory");
})

app.post("/newSubCategory",function(req,res){
	SubCategory.create({
		name:req.body.subCategory
	},function(err,subCategory){
		res.redirect("/subCategories/"+subCategory._id+"/edit");
	});

})

app.get("/subCategories/:_id/edit",function(req,res){
	SubCategory.findById(req.params._id).populate("subCategories").exec(function(err,subCategory){
		SubSubCategory.find({},function(req,subSubCategories){
			res.render("editSubCategory",{subCategory:subCategory,subSubCategories:subSubCategories});
		})
		
	})
});

app.put("/subCategories/:_id/edit",function(req,res){
	var a1,b1;
	SubCategory.findById(req.params._id,function(err,subCategory){
		var a,b;
		b=[];
		a=subCategory.subCategories;
		
		var removed=req.body.removed.split(",");
		for(var i=0;i<a.length;i++)
		{
			var flag=0;
			for(var j=0;j<removed.length;j++){
				if(a[i]==removed[j])
					flag=1;
			}
			if(flag==0){
				b.push(a[i]);
			}
		}
		
		for(var i=0;i<req.body.subCategory.length;i++)
		{
			if(req.body.subCategory[i]!="none")
				b.push(req.body.subCategory[i]);
		}
		if(subCategory.name==req.body.name&&subCategory.subCategories==b){
			res.redirect("/subCategories");
		}
		SubCategory.create({
			name:req.body.name,
			subCategories:b
		},function(err,category1){});
	})
	SubCategory.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/subCategories");
	})
})

app.get("/subCategories/:_id/delete",function(req,res){
	SubCategory.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/subCategories");
	})
});

/*------------------------------------------------------------*/
/*----------------SUB-SUBCATEGORY REALTED---------------------*/
/*------------------------------------------------------------*/
app.get("/subSubCategories",function(req,res){
	SubSubCategory.find({},function(err,subSubCategories){
		if(!err){
			res.render("subSubCategories",{subSubCategories:subSubCategories});
		}
	})
});

app.get("/subSubCategories/new",function(req,res){
	res.render("newSubSubCategory");
});


app.post("/newSubSubCategory",function(req,res){
	SubSubCategory.create({
		name:req.body.subSubCategory
	},function(err,subSubCategory){
		res.redirect("/subSubCategories/"+subSubCategory._id+"/edit");
	});

});


app.get("/subSubCategories/:_id/edit",function(req,res){
	SubSubCategory.findById(req.params._id).populate("features").exec(function(err,subCategory){
		Feature.find({},function(req,features){
		res.render("editSubSubCategory",{subCategory:subCategory,features:features});
	})
	})
})


app.put("/subSubCategories/:_id/edit",function(req,res){
	var a1,b1;
	SubSubCategory.findById(req.params._id,function(err,subCategory){
		var a,b;
		b=[];
		a=subCategory.features;
		
		var removed=req.body.removed.split(",");
		for(var i=0;i<a.length;i++)
		{
			var flag=0;
			for(var j=0;j<removed.length;j++){
				if(a[i]==removed[j])
					flag=1;
			}
			if(flag==0){
				b.push(a[i]);
			}
		}
		
		for(var i=0;i<req.body.feature.length;i++)
		{
			if(req.body.feature[i]!="none")
				b.push(req.body.feature[i]);
		}
		if(req.body.name==subCategory.name&&subCategory.features==b){
			res.redirect("/subSubCategories");
		}

		SubSubCategory.create({
			name:req.body.name,
			features:b
		},function(err,category1){});
	})
	SubSubCategory.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/subSubCategories");
	})
})


app.get("/subSubCategories/:_id/delete",function(req,res){
	SubSubCategory.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/subSubCategories");
	})
});

/*--------------------------------------------------------------------------*/
/*---------------------FEATURES---------------------------------------------*/
app.get("/features",function(req,res){
	Feature.find({},function(err,features){
		res.render("features",{features:features});
	})
})

app.get("/newProduct",function(req,res){
	res.render("question");
})

app.get("/newProducts",function(req,res){
	res.render("newProduct");
})

app.post("/newProduct",function(req,res){
	
	var id;
	/*Category.create({
		name:req.body.category
	},function(err,category){
			SubCategory.create({
				name:req.body.subcategory
			},function(err,sub){
				var sum=0;
				var id;

				for(var i=0;i<req.body.subsubcategory.length;i++)
				{
					console.log(i);
					async.series([
						SubSubCategory.create({
							name:req.body.subsubcategory[i]
						},function(err,subsub){
							console.log("********************");
							console.log(i);
							for(var j=sum;j<sum+req.body.num[i];j++)
							{
								Feature.create({
									name:req.body.feature[j],
									options:req.body.answer[j].split(",")
								},function(err,feature){
									var ing=subsub.features;
									ing.push(feature);
									SubSubCategory.findByIdAndUpdate(subsub._id,{
										name:subsub.name,
										features:ing
									},function(err,k){});
									id=subsub._id;
								})
							}
							sum=sum+req.body.num[i];
							var dec=sub.subCategories;
							dec.push(subsub);
							SubCategory.findByIdAndUpdate(sub._id,{
								name:category.name,
								subCategories:dec
							},function(err,s){});
						})
					]);
				}
				var po=category.subCategories;
				po.push(sub);
				Category.findByIdAndUpdate(category._id,{
					name:category.name,
					subCategories:po
				},function(req,res){});
			})
			console.log(category);
	})*/
	async.waterfall([
		function(callback){
			Category.create({
			name:req.body.category
		},function(err,category){
			callback(null,category);
		});
		},
		/*function(category,callback){
			var list=[]
			for(var i=0;i<5;i++){
				list.push(i);
		}
		async.forEachOf(list,
		function(key,callback){
			console.log(category);
		});
			
		}*/
		function(category,callback){
			SubCategory.create({
				name:req.body.subcategory
			},function(err,sub){callback(null,category,sub)});
		},

		function(category,sub,callback){
			var sum=0;
			var id;
			var list=[];
			for(var i=0;i<req.body.subsubcategory.length;i++)
				{
					list.push(i);
				}
			async.forEachOf(list,function(key,callback){
				SubSubCategory.create({
							name:req.body.subsubcategory[Number(key)]
						},function(err,subsub){
						
							for(var j=sum;j<sum+Number(req.body.num[Number(key)]);j++)
							{
								Feature.create({
									name:req.body.feature[j],
									options:req.body.answer[j].split(",")
								},function(err,feature){
									var ing=subsub.features;
									ing.push(feature);
									SubSubCategory.findByIdAndUpdate(subsub._id,{
										name:subsub.name,
										features:ing
									},function(err,k){});
									id=subsub._id;
								})
							}
							sum=sum+Number(req.body.num[Number(key)]);
							var dec=sub.subCategories;
							dec.push(subsub);
							SubCategory.findByIdAndUpdate(sub._id,{
								name:sub.name,
								subCategories:dec
							},function(err,s){});
						})
			})
			callback(null,category,sub);
		},

		function(category,sub,callback){
			var po=category.subCategories;
				po.push(sub);
				Category.findByIdAndUpdate(category._id,{
					name:category.name,
					subCategories:po
				},function(req,res){});
		}
	]);
	res.redirect("/categories");
})

/*async.waterfall([
	function(callback){
		Category.create({
		name:req.body.category
	},callback(null,category,err));
	}
	function(err,category,callback){
		console.log(category);
	}
])*/

app.get("/features/new",function(req,res){
	res.render("newFeature");
});


app.post("/newFeature",function(req,res){
	Feature.create({
		name:req.body.Feature
	},function(err,feature){
		res.redirect("/features/"+feature._id+"/edit");
	});
});


app.get("/features/:_id/edit",function(req,res){
	Feature.findById(req.params._id,function(err,feature){
		res.render("editFeature",{feature:feature})
	})
})


app.put("/features/:_id/edit",function(req,res){
	var a1,b1;
	Feature.findById(req.params._id,function(err,feature){
		var b=[];
		for(var i=0;i<req.body.option.length;i++)
		{
				b.push(req.body.option[i]);
		}
		if(feature.name==req.body.name&&feature.options==b){
			res.redirect("/features");
		}
		Feature.create({
			name:req.body.name,
			options:b
		},function(err,category1){});
	})
	Feature.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/features");
	})
})


app.get("/features/:_id/delete",function(req,res){
	Feature.findByIdAndRemove(req.params._id,function(err){
		res.redirect("/features");
	})
});


/*--------------------------------------------------------------*/
/*--------------------------------------------------------------*/
/*------------------OTHER UTILITIES-----------------------------*/


app.get("/requests",function(req,res){
	Request.find({},function(err,requests){
		res.render("requests",{requests:requests});
	})
});

app.get("/requests/:_id/create",function(req,res){
	Request.findById(req.params._id,function(err,request){
		res.render("approve",{request:request});
	})
})

app.post("/request",function(req,res){
	Feature.create({
		features:req.body.feature,
		options:req.body.options.split(",")
	},function(err,f){
		SubSubCategory.create({
			name:req.body.subsubcategory,
			features:f
		},function(err,ssc){
			SubCategory.create({
				name:req.body.subcategory,
				subCategories:ssc
			},function(err,sc){
				Category.create({
					name:req.body.category,
					subCategories:sc
				},function(req,res){});
			})
		})
	})
	res.redirect("/categories");
})

app.get("/requests/:_id/delete",function(req,res){
	Request.findOneAndDelete(req.body._id,function(err){});
	res.redirect("/requests");
})

app.get("/complaints/:_id/delete",function(req,res){
	Complaint.findOneAndDelete(req.params._id,function(req,res){});
	res.redirect("/complaints");
}) 

app.get("/complaints",function(req,res){
	Complaint.find({},function(err,complaints){
		
		res.render("complaints",{complaints:complaints});
	})
});


app.get("/users",function(req,res){
	res.render("users");
});


app.listen("3000",function(){
	console.log("Running");
});

/*app.listen(process.env.PORT,process.env.IP,function(){
	console.log("Running");
});*/