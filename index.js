const express = require('express')
const user = require('./models/user')
const { urlencoded } = require('body-parser')
const cookieParser = require('cookie-parser')
const app= express()

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(cookieParser())
 
const authentication_check = (req,res,next)=>{
 
  if(req.cookies.loggedin){
  next()
  }else{
   res.redirect('/login')
  }
}


app.get('/',authentication_check,async(req,res)=>{
    if(req.cookies.name){
      try{
        const data =await user.usermodel.findOne({name:`${req.cookies.name}`})
        if(data){
          res.render('todo',{username:`${req.cookies.name}`,user:`${data.task}`})
        }else{
          res.render('todo',{username:`${req.cookies.name}`,user:null})
        }
        
      }catch(err){console.log(err)}
        
    }else{
        res.render('todo',{username:`Guest`})
    }
    
})


app.get('/login',(req,res)=>{
     
  for(let i = 0 ; i<1000;i++){
    if(req.cookies[i]){
    res.clearCookie(`${i}`)
    }else{
      res.clearCookie("name").cookie("loggedin", `false`).render('login')
      break;
    }
   }
  
    
    
  }
    
)
app.post('/login',async (req,res)=>{
    try{
        
        const {name ,pass}= req.body;
          const check =  await user.userbasic.findOne({name:name})
          if(check){
            res.clearCookie().cookie("name", `${name}`).cookie("loggedin", `true`).redirect('/')
          }else{
            res.clearCookie().redirect('/signup')
          }

     }catch(err){console.log(err)}
    


})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.post('/signup',async (req,res)=>{
  try{
      
      const {name , email ,pass}= req.body;
      const user_info = await user.userbasic.create({
        name , 
        email ,
        pass 
     }) 
      res.cookie("name", `${name}`).cookie("loggedin", `true`).redirect('/')
  
    
    
  }catch(err){console.log(err)}
  


})



  // adding data in mongodb
  
 let counter=0;
  app.post('/add',async(req,res)=>{
      try{
      const data= await user.usermodel.findOne({name:req.cookies.name})
      if(data){
        if(req.cookies[data.task.length]==null){
          const updatedata=  data.task.push(req.cookies[counter])
        }else{
          const updatedata=  data.task.push(req.cookies[data.task.length])
        }
      
      const update= await user.usermodel.findOneAndReplace({name:req.cookies.name},data)
      data.task.length++
      counter++
      }else{
      let i =0
      const task =[req.cookies[i]]
      console.log(req.cookies)
      const user_todo =await user.usermodel.create({
        name:req.cookies.name, 
        task
      })
      
     
     }
     res.redirect('/')

    }catch(err){
      console.log(err)
    }
  })


app.delete('/delete',async(req,res)=>{
    try{
        const update= await user.findOneAndDelete({username:req.query.username})
        
       }catch(err){
         console.log(err)
       }

})
 
app.get('/read',async(req,res)=>{
    try{
        const read= await user.findOne({username:req.query.username})
        res.send(`${read}`)
        
       }catch(err){
         console.log(err)
       }

})








app.listen("4000",()=>{console.log("server is woking")})