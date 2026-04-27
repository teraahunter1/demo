const express=require('express');
const app= express();
const ejs = require('ejs');
const path = require('path');
const connectDB = require('./db');
const Contact = require('./models/user');
const Product = require('./models/product');
connectDB(); // Connect to MongoDB

app.use(express.urlencoded({ extended: true })); // ✅ must


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');                                                                                                             


// Middleware
app.use(express.json());


app.use(express.static(path.join(__dirname, 'staticfiles')));




// 🔌 MongoDB Connection (simple)
app.post('/add-user', async (req, res) => {
        const { name, email, phone, subject, message } = req.body;

        try {
            const newUser = new Contact({ name, email, phone, subject, message });
            await newUser.save();
            res.status(201).json({ message: 'User added successfully', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Error adding user', error: error.message });
        }
    });


app.get('/', async (req, res) => {
  const body = await ejs.renderFile(path.join(__dirname, 'views', 'index.ejs'), { name: "John" });
  res.render('base', { body, title: 'My Portfolio - Home' });
});

app.get('/form', async (req, res) => {
   const msg = req.query.msg ? String(req.query.msg) : '';
   const body = await ejs.renderFile(path.join(__dirname, 'views', 'form.ejs'), { msg });
   res.render('base', { body, title: 'Contact Form' });
});

app.get('/complaints', async (req, res) => {
    try {
        const complaints = await Contact.find({});
        const body = await ejs.renderFile(path.join(__dirname, 'views', 'complaints.ejs'), { complaints: complaints });
        res.render('base', { body, title: 'Complaint Records' });
    } catch (error) {
        res.status(500).send('Error fetching complaints');
    }
});

app.get('/records', async (req, res) => {
    try {
        const records = await Contact.find({});
        const body = await ejs.renderFile(path.join(__dirname, 'views', 'records.ejs'), { records });
        res.render('base', { body, title: 'All Records' });
    } catch (error) {
        res.status(500).send('Error fetching records');
    }
});

app.get("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await Contact.findByIdAndDelete(req.params.id);
        res.redirect("/records");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting record");
    }
});

app.get("/edit/:id", async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    const body = await ejs.renderFile(path.join(__dirname, 'views', 'edit.ejs'), { contact: contact });
    res.render('base', { body, title: 'Edit Contact' });
});

app.post("/update/:id", async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    await Contact.findByIdAndUpdate(req.params.id, { name, email, phone, subject, message });
    res.redirect("/records");
});




app.post("/submit", async (req, res) => {
  try {
    const name = req.body.txtname;
    const email = req.body.txtemail;
    const mob = req.body.txtmob;
    const company = req.body.txtcompany;
    const subject = req.body.txtsubject;
    const message = req.body.txtmessage;

    const newContact = new Contact({
      name: name,
      email: email,
      phone: mob,
      company: company,
      subject: subject,
      message: message,
      resolved: false
    });
    await newContact.save();
    console.log("Contact saved:", newContact);
    const msg = "Enterprise inquiry submitted successfully! Our team will contact you within 24 hours.";
    res.redirect('/form?msg=' + encodeURIComponent(msg));

  } catch (err) {
    console.error(err);
    const msg = "Error submitting inquiry. Please try again or contact enterprise support.";
    res.redirect('/form?msg=' + encodeURIComponent(msg));
  }
});       

    
app.listen(3000,()=>{
    console.log('Server is running on http://localhost:3000');
});
