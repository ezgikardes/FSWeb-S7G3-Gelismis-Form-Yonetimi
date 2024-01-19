import { useState } from "react";
import { useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";

export default function Form({addNewUser}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    toc: false,
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    toc: "",
  });

  //useEffect'teki cevabı saklamak için bir state yazalım: 
  const [formValid, setFormValid] = useState(false);

  const formSchema = Yup.object().shape({
    name: Yup.string().required("İsim alanı zorunlu"),
    email: Yup.string()
      .email("Geçerli bir email girin")
      .required("Email alanı zorunlu"),
    password: Yup.string()
      .required("Şifre alanı zorunlu")
      .min(6, "Şifre en az 6 karakterden oluşmalı"),
    toc: Yup.boolean()
      .oneOf([true], "Kullanım şartlarını kabul etmelisiniz"),
  })


  //bu metodun açıklaması aşağıdaki notlar kısmında
  const handleChange = (e) => {
    const { type, value, checked, name } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : value,
    });

    //buradan sonraki kısım, formun içerisindeki her bir field valid mi değil mi diye kontrol ettiğimiz yup kütüphanesinden ezberlenip yapılabilecek:

    Yup.reach(formSchema, name) //önce formSchema'ya git ve name alanını al
      .validate(type === "checkbox" ? checked: value)
      .then((valid) => { //then kısmında valid durumunu yakalıyoruz.
        setFormErrors({
          ...formErrors,
          [name]: "", // hata yoksa, hata mesajları state'indeki hata mesajını siliyoruz.
        });
      })
      .catch((err) => { //catch kısmında hata durumunu yakalıyoruz.
        setFormErrors({
          ...formErrors,
          [name]: err.errors[0], //bu alanın hata mesajını yazdırıyoruz.
        });
      })
  };

  //form submit edildiğinde konsola validasyonla ilgili mesajlar göndermek için eklemeler yapalım:
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValid) { //dataları axios ile servar'a gönder
      axios.post("https://reqres.in/api/users", formData)
      .then((res) => {
        console.log("server'dan cevap geldi :", res); 
        addNewUser(res.data)//yeni kullanıcıyı app komponentine gönder
      })
      .catch((err) => {
        console.log("server'dan cevap geldi :", err)
      })
    } else {
      //kullanıcıyı bilgilendir
      console.warn("Form validasyonu başarısız");
    }

    console.log("formData > ", formData);
  };

  //formData'yı dinleyen useEffect', formData her değiştiğinde formSchema'ya git ve valid mi değil mi bak, valid'se, söz konusu değerleri formValid state'ine setle.
  useEffect(() => {
    formSchema.isValid(formData)
    .then((valid) => setFormValid(valid));
  }, [formData]);


  //error mesajları için bir useEffect daha yapıyoruz
  useEffect(() => {
    console.error("formErrors > ", formErrors); //formErrors state'indeki hata mesajlarını console'a yazdırıyoruz.
  }, [formErrors])

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          İsim:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}></input>
        </label>
        {formErrors.name && 
        (<div className="input-error">{formErrors.name}</div>)} {/* conditional rendering yaptık. eğer formErrors içindeki name alanında değer varsa, formErrors state'indeki ilgili name alanındaki hata mesajını div'e yazdırıyoruz.*/}
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}></input>
        </label>
        {formErrors.email && 
        (<div className="input-error">{formErrors.email}</div>)}
      </div>
      <div>
        <label>
          Şifre:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}></input>
        </label>
        {formErrors.password && 
        (<div className="input-error">{formErrors.password}</div>)}
      </div>
      <div>
        <label>
          Kullanım Şartları
          <input
            type="checkbox"
            name="toc"
            value={formData.toc}
            onChange={handleChange}></input>
        </label>
        {formErrors.toc && 
        (<div className="input-error">{formErrors.toc}</div>)}
        <button 
          type="submit" 
          disabled={!formValid} //form Valid değilse disable özelliğini aktif et.
        >
          Gönder
        </button> 
    
      </div>
    </form>
  );
}


/*notlar: 

formumuzda inputlarımız arasında checkbox olmasaydı, handlecChange metodunu şöyle yazabilirdik:

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

Ama checkbox'larda value prop'u yok, checked prop'u var. o yüzden, type'ına bak, checkbox ise value propuna bak, değilse checked prop'una bak diyoruz. Şu şekilde: 

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
  });
};

Kod içerisinde çok fazla e.target dediğimiz için, e target'ın burada kullandığımız tüm özelliklerini deconsturing yöntemiyle e.targettan alıp kısaltıyoruz: 

const handleChange = (e) => {

  const { type, value, checked, name } = e.target;
  setFormData({
    ...formData,
    [name]: type === "checkbox" ? checked : value,
  });
};


*/