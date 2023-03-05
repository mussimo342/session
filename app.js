const express=require('express');
const app=require('express')();
const session=require('express-session');
const port=5050;
const path = require('path');
const MongoStore = require('connect-mongo');
app.use(express.json());// הגדרת השכבה לטיפול בבקשות מסוג ג''יסון
app.use(express.urlencoded({extended:true}));
const twentyMin = 1000 * 60 * 20; // 20 דקות
app.use(session({// הגדרת שכבת הביניים המטפלת בסשנים
    secret:'asdsadsdd',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:twentyMin},
    store: MongoStore.create({// זו התוספת שהוספנו כדי לעבוד עם סשנים שמנוהלים בשרת מונגו
        mongoUrl: 'mongodb+srv://adminleonid:0528557790nba@cluster0.xkd60.mongodb.net'       
      })
}));

app.get('/',async(req,res)=>{    
    res.sendFile(path.join(__dirname + '/index.html'));
});
// ניתוב זה משמש להתחברות למערכת לוגין
app.post('/login',(req,res)=>{
   
  
    const User = req.body.User;
    const Pass = req.body.password;
    console.log(User);
    console.log(Pass);
    if(User=='a' && Pass=='a')
    {   const UserData={Uid:1,User,Pass,Fullname:'Leonid Shakalo'};
        req.session.user=UserData;
        res.sendFile(path.join(__dirname + '/home.html'));
        //return res.status(200).json(User);
    }
    else
        return res.status(200).json({Msg:'Wrong authentication'});
});
// ניתוב זה משמש להצגה של נתונים רק למשתמשים בעלי הרשאות, ולכן נבדק האם קיים סשן של יוזר
app.get('/manage',async(req,res)=>{    
    if(req.session.user)
        return res.status(200).json({Msg:`Welcome ${req.session.user.Fullname} `}); 
    else
        return res.status(407).json({Msg:`Not Authorized `});
});

app.get('/logout',(req,res)=>{
    req.session.destroy();    
        return res.status(200).json({Msg:'You\'ve Been Logged out '});
});
app.listen(port,()=>{console.log('server started')});