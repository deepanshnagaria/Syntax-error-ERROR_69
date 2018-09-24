var e= require("express"),bodyparser=require("body-parser"),mongoose=require("mongoose"),methodOverride=require("method-override");
var app=e();
Schema=mongoose.Schema;
var passport= require("passport"),LocalStrategy= require("passport-local"),passportLocalMongoose= require("passport-local-mongoose");
var User= require("./models/user");

mongoose.connect("mongodb://ketan:deepansh15@ds213183.mlab.com:13183/final_app", { useNewUrlParser: true });
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
	localRate:Number,
	townRate:Number,
	stateBased:Number,
	countryBased:Number,
	internationalBased:Number
})
var Payment=mongoose.model("Payment",paymentSchema);


var featureSchema=new mongoose.Schema({
	name:String,
	options:[{type:String}],
	selected:String
})
var Feature=mongoose.model("Feature",featureSchema);


var subSubCategorySchema=new mongoose.Schema({
	name:String,
	features:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"Feature"
	}]
});
var SubSubCategory=mongoose.model("SubSubCategory",subSubCategorySchema);



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
	localRate:2,
	townRate:3,
	stateBased:4,
	countryBased:7,
	internationalBased:10
});*/

app.get("/root",function(req,res){
	res.render("rootadmin");
});

app.get("/",function(req,res){
	res.redirect("/root");
});

app.get("/payment",function(req,res){
	Payment.findOne({},function(err,payment){
		res.render("payments",{payment:payment});
	})
})

app.put("/rates/:_id/edit",function(req,res){
	Payment.findByIdAndUpdate(req.params._id,req.body.payment,function(err,f){
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
})

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
	res.render("requests");
});


app.get("/complaints",function(req,res){
	res.render("complaints");
})


app.get("/users",function(req,res){
	res.render("users");
});


/*app.listen("3000",function(){
	console.log("Running");
});*/

app.listen(process.env.PORT,process.env.IP,function(){
	console.log("Running");
});