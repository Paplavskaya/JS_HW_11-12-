class User {                                                //п1.1   создаем класс для каждого отдельного контакта
    constructor(data) {                                     //п1.2   создаем конструктор и передаем в него объект
       this.data = data;                                    //п1.3   сохраняем объект в св-во this.data
    }    

    edit(updatedData) {                                     //п1.4   создаем метод редактирования и передаем в него измененные параметры объекта
        this.data = {                                       //п1.5   перезаписываем обновленные данные в this.data
            ...this.data,                                   //п1.6   сохраняем все параметры объекта this.data используя спрэт оператор 
            ...updatedData,                                 //п1.7   передаем обновленные параметры объекта    
        };
    }

    get() {                                                 //п1.8   создаем метод получения данных о контакте
        return this.data                                    //п1.9   возвращаем this.data
    }
}

class Contacts {                                            //п2.1   создаем класс для хранения массива с контактами
    constructor() {                                         //п2.2   создаем конструктор
        // this.contactsData = [                               //п2.3   создаем массив контактов
        //     new User({                                      //п2.4   на основе класса User создаем контакт 1
        //         id: '1',
        //         name: 'alex',
        //         email: 'alex@test.by',
        //         address: 'Minsk',
        //         phone: '+375 (29) 333 33 33'
        //     }),
            
        //     new User({                                      //п2.5   на основе класса User создаем контакт 2
        //         id: '2',
        //         name: 'Bob',
        //         email: 'bob@test.by',
        //         address: 'Minsk',
        //         phone: '+375 (29) 222 33 33'
        //     })
        // ];
        // this.contactsData = JSON.parse(localStorage.getItem('contactsItem')) || [];
        this.contactsData = this.createUserFromLocalStorage() ?? [];
        console.log(this.contactsData);
        this.deleteLocalStorage()
    }

    createCookie(){
        let days = 10;
        let seconds = days*24*60*60;
        document.cookie = `storageExpiration=${JSON.stringify(this.contactsData)}; max-age=${seconds}`        
    }

    deleteLocalStorage(){
        if(document.cookie.length === 0) {
            localStorage.clear()
        } 
    }

    createUserFromLocalStorage() {
       const localStorageData = JSON.parse(localStorage.getItem('contactsItem'));
       if(!localStorageData) {
            return undefined;
       }

       const userFromLocalStorage = localStorageData.map((item) => {
            return new User(item.data)
       }) 
          
       return userFromLocalStorage;
    }

    setLocalStoStorage() {
        this.createCookie()
        localStorage.setItem('contactsItem', JSON.stringify(this.contactsData));    //п4.   сохраняем данные в localStorage, первыйм пораметром передаем ключ, вторым значение
                                                                                    //  так как в значении дожна быть строка, а у нас массив, переводим массив в строку с помощью JSON.stringify
    }

    add(userData) {                                         //п2.6   создаем метод добавления нового контакта в массив, передавая некий объект
        this.contactsData.push(new User(userData));         //п2.7   пушим в массив контакта, созданного на основе класса User
        console.log(this.contactsData)
        
        this.setLocalStoStorage();
    }

    editContactUser(id, updatedUserData) {                  //п2.8   создаем метод для редактирования информации конкретного контакта, в метод передаем id и обновленные параметры
        this.contactsData = this.contactsData.map((user) => {   //п2.9   используем метод map, что бы создать новый массив с обновленными данными контакта
            if (user.data.id === id) {                      //п2.10  ставим условие, если переданное id соответсвует id пользователя, то
                user.edit(updatedUserData);                 //п2.11  для контакта вызывается метод редактирования класса User, в который передаются обновленные параметры
            }
            return user ;                                   //п2.12  возвращаем контакт с обновленными параметрами       
        })
       
        this.setLocalStoStorage();
    }

    removeContactUser(id) {                                 //п2.13  создаем метод удаления определенного контакта из массива, в метод передаем id
        this.contactsData = this.contactsData.filter((user) => user.data.id !== id);    //п2.14  используем метод filter, для создания нового массива с объектами, в которых условие (id контакта не равно переданному в метод id) является true...остальные объекты не попадут в массив
        // this.contactsData = this.contactsData.filter(({data: {id: userId}}) => userId !== id); //декструктуризация
       
        this.setLocalStoStorage();
    }

    get() {                                                 //п2.15  создаем метод для получения всех контактов
        return this.contactsData;                           //п2.16  возвращаем this.contactsData
    }
}

class ContactsApp extends Contacts{                         //п3.1   создаем класс для интерфейса и показа его в браузере, наследуем его от класса Contacts
    constructor() {                                         //п3.2   создаем конструктор
        super();                                            //п3.3   вызываем super, что бы одновременно с конструктором класса запускался конструктор родителя
        this.app = this.createRootElement();                //п3.9   создаем элемент на основе метода createRootElement

        document.body.appendChild(this.app);                //п3.10  добавляем корневой с
        this.addContactEvent();                             //п3.16  запускаем обработчика для кнопки Добавить контакт
        this.get()                                          //п3.46  запускаем метод, что бы отрисовать то, что уже имеется 
        this.self = this; 
    }

    createRootElement() {                                   //п3.4   создаем метод формирования корневого элемента контактной книги
        const rootElement = document.createElement('div');  //п3.5   создаем обертку
        rootElement.classList.add('contacts');              //п3.6   присваиваем класс обетке
        rootElement.innerHTML = `
                                <div class="conteiner">
                                    <div class="contacts__wrapper">
                                        <div class="contacts__header">
                                            <h2 class="contacts__title">Контакты</h2>
                                            <div class="contacts__form">
                                                <input type="text" class="contact__name contacts__input" placeholder="Имя">
                                                <input type="phone" class="contact__phone contacts__input" placeholder="Телефон">
                                                <input type="email" class="contact__email contacts__input" placeholder="e-mail">
                                                <input type="text" class="contact__address contacts__input" placeholder="Адрес">
                                                <button class="contact__btn btn">Добавить контакт</button>
                                            </div>
                                        </div>
                                        <div class="contacts__body"></div>
                                    </div>
                                </div>
                                `;                          //п3.7   создаем структру HTML корневого элемента
        return rootElement;                                 //п3.8   возвращаем элемент
    }

    addContactEvent(){                                      //п3.11  создаем метод обработчика для кнопки Добавить контакт
        const addBtn = document.querySelector('.contact__btn'); //п3.12  находим кнопку по селектору классов
        addBtn.addEventListener('click', () => {            //п3.13  вешаем событие по клику          
            this.onAdd();                                   //п3.15  вызываем метод onAdd
        })
    }

    onAdd(){                                                            //п3.14  создаем метод добавления контакта
        const name = document.querySelector('.contact__name');          //п3.17  находим поле инпута name
        const phone = document.querySelector('.contact__phone');        //п3.18  находим поле инпута phone
        const email = document.querySelector('.contact__email');        //п3.19  находим поле инпута email
        const address = document.querySelector('.contact__address');    //п3.20  находим поле инпута address

        const userData = {                                  //п3.21  создаем пользователя
            id: new Date().getTime().toString(),            //п3.22  генерируем id - временную метку и переводим в строку
            name: name.value,                               //п3.23  принимаем значение name из сво-ва инпута value
            email: email.value,                             //п3.24  принимаем значение email из сво-ва инпута value
            address: address.value,                         //п3.25  принимаем значение address из сво-ва инпута value
            phone: phone.value,                             //п3.26  принимаем значение phone из сво-ва инпута value
        }

        if(name.value.length === 0 || email.value.length === 0 ||
            address.value.length === 0 || phone.value.length === 0
        ) {return
        }  else {
            this.add(userData);                                 //п3.27  вызываем метод add из родительского конструктора и передаем ему созданного пользователя                           
        }

        name.value = '';                                    //п3.28  очищаем поле инпута name после добавления контакта
        phone.value = '';                                   //п3.29  очищаем поле инпута phone после добавления контакта
        email.value = '';                                   //п3.30  очищаем поле инпута email после добавления контакта
        address.value = '';                                 //п3.31  очищаем поле инпута address после добавления контакта
        this.get()                                          //п3.47  запускаем метод отрисовки
    }

    get(){                                                  //п3.32  создаем метод для получения и обновления списка контактов                             
        const getContactsData = super.get();                //п3.33  забираем весь массив данных, через наследуемый метод get родительского класса через super

        const contactsBodyElement = document.querySelector('.contacts__body');     //п3.34  по слектору класса находим блок, в котором обновляется разметка
        
        let ulContacts = document.querySelector('.contacts__items'); //п3.35 ищем наш список контактов ul
        
        if(!ulContacts) {                                    //п3.36  задаем условие, если поиск по селектору вернут ul нул, т.е не нашел (!ulContacts) true
            ulContacts = document.createElement('ul');       //п3.37  создаем список 
            ulContacts.classList.add('contacts__items');     //п3.38  присваиваем класс списку
        } else {
            ulContacts.innerHTML = '';                       //п3.39  иначе, если ul уже есть, делаем список пустым
        }
        
        let contactList = '';                                   //п3.40  cоздаем переменную для пустого списка дел через let, так как она может меняться 
        getContactsData.forEach(({data}) => {                   //п3.41  используем метод перебора массива (который является результатом работы родительского метода get) и закидываем в аргумент св-во data из объекта массива
            const {id, name, phone, email, address} = data;     //п3.42  делаем pеструктуризацию св-ва data  (вместо этого, можно было в аргументе метода forEach указать - {data: {id, name, phone, email, address}})          
            contactList += `<li class="contacts__item">
                                <div class="item__name"><span class="item__title">Имя:</span> ${name}</div>
                                <div class="item__phone"><span class="item__title">Телефон:</span> ${phone}</div>
                                <div class="item__email"><span class="item__title">E-mail:</span> ${email}</div>
                                <div class="item__address"><span class="item__title">Адрес:</span> ${address}</div>
                                <div class="item__btns">
                                    <button class="btn__delete btn" id="${id}">Удалить</button> 
                                    <button class="btn__edit btn" data-edit="${id}">Редактировать</button>
                                </div>                                                    
                            </li>`;                           //п3.43  формируем HTML-структуру контакта
                            
        })

        ulContacts.innerHTML = contactList;                   //п3.44  закибываем в список ul наши li        
        contactsBodyElement.appendChild(ulContacts);          //п3.45  закидываем весь список в нужный блок
        this.addDeletEventBtns();                             //п3.56  запускаем метод
        this.addEditEventBtns();
    }

    onRemove(id) {                                            //п3.52  создаем метод удаления контакта, принимаем id                                
        this.removeContactUser(id);                           //п3.53  вызываем наследованный метод от родительского класса, закидываем в него id
        this.get();                                           //п3.54  запускаем метод, что бы обновить отрисовку списка
    }

    onStartEdit(editId) {                                     //п3.73  начало редактирования
        const getContactsData = super.get();                  //п3.74  забираем весь массив данных, через наследуемый метод get родительского класса через super 
        
        // const editUserData = getContactsData.find((contactUserData) => contactUserData.data.id === editId).data;
        // const editUserData = getContactsData.find(({data}) => data.id === editId).data;

        const editUserData = getContactsData.find(({data: {id}}) => id === editId).data;  //п3.75 находим данные (объект) для редактирования (find находит первый найденный true результат) 
                                                                                          // в п3.75 в конце ставим .data, так как для редактирования нас интересуют только данные в св-ве data
        const modal = new Modal(editUserData, this.onEdit.bind(this));     //п3.76  создаем модальное окно на основе класса, передаем нашего user-а и метод onEdit, в который с помощью bind переносим контекст текущего контструктора, а не модального окна
    }

    onEdit({id, ...updateData}) {                                   //п3.78  метод редактирования данных в списке        
        this.self.editContactUser(id, updateData);                  //п3.91  запускаем метод редактирования контакта из родительского класса, передавая данные из модального окна
        this.self.get();                                            //п3.92  запускаем метод отрисовки
    }

    addEditEventBtns() {                                      //п3.57  создаем метод поиска кнопки Редактировать и навешивания на нее события                         
        const editContactsBtn = document.querySelectorAll('.btn__edit');    //п3.58  ищем все кнопки редактирования в списке контактов (All возвращает массив кнопок)
        editContactsBtn.forEach((editBtn) => {                //п3.59  перебираем каждую кнопку полученного массива и навешиваем событие
            editBtn.addEventListener('click', (event) => {    //п3.60  навешиваем событие по клику на кнопку, в сallback ф-цию прокидываем событие (event)
                this.onStartEdit(event.target.dataset.edit);  //п3.77  запускаем метод начала редактирования, передаем в него id кнопки, по которому произошло событие
            })
        })
    }

    addDeletEventBtns() {                                      //п3.48  создаем метод поиска кнопки Удалить и навешивания на нее события
        const deletContactsBtn = document.querySelectorAll('.btn__delete');   //п3.49  ищем все кнопки удаления в списке контактов (All возвращает массив кнопок)
        deletContactsBtn.forEach((deletBtn) => {               //п3.50  перебираем каждую кнопку полученного массива и навешиваем событие
            deletBtn.addEventListener('click', (event) => {    //п3.51  навешиваем событие по клику на кнопку, в сallback ф-цию прокидываем событие (event)
                this.onRemove(event.target.id);                //п3.55  вызываем метод, и передеаем id кнопки, по которому произошло событие (у события мы можем обратиться к target и забрать id)
            })
        })
    }

}

class Modal {                                                 //п3.61  создаем класс для модального окна  
    constructor(contactData, onEdit) {                        //п3.62  создаем конструктор, который принимает данные одного пользователя и ф-цию                
        this.contactData = contactData;                         
        this.heandleUserEdit = onEdit;                        //п3.79  сохраняем фу-цию в переменную (без вызова)
        this.modalHtmlElement = this.createModalHtml(this.contactData);     //п3.68 создаем элемент с помощью метода создания модального окна, закидываем в него наш объект user 
        document.body.appendChild(this.modalHtmlElement)      //п3.69  добавляем наше модальное окно в DOM  
        this.addCancelEvent();                                //п3.73  запускаем метод
        this.addSaveEvent();                                  //п3.90  запускаем метод
    }

    addCancelEvent() {                                         //п3.70  метод закрытия модального окна
        const cancelBtn = document.querySelector('.modal__cancel__btn');    //п3.71  находим кнопку Закрыть через селектор классов
        cancelBtn.addEventListener('click', () => {            //п3.71  вешаем событие на кнопку по клику
            this.modalHtmlElement.remove();                    //п3.72  удаляем наш элемент  модального окна через remove
        })
    }

    addSaveEvent() {                                           //п3.80  метод сохранения изменений и закрытия модального окна
        const saveBtn = document.querySelector('.modal__save__btn');    //п3.81  находим кнопку Сохранить через селектор классов
        saveBtn.addEventListener('click', (event) => {         //п3.82  вешаем событие на кнопку по клику
            
            const name = document.querySelector('.modal__edit__name').value;          //п3.83  находим поле инпута name и забираем значения из value
            const phone = document.querySelector('.modal__edit__phone').value;        //п3.84  находим поле инпута phone и забираем значения из value
            const email = document.querySelector('.modal__edit__email').value;        //п3.85  находим поле инпута email и забираем значения из value
            const address = document.querySelector('.modal__edit__address').value;    //п3.86  находим поле инпута address и забираем значения из value

            this.heandleUserEdit({                             //п3.87  записываем значения из полей инпута объектом
                id: event.target.id,                           //п3.88  принимаем значение id через target события event
                name,                               
                email,                             
                address,                         
                phone,                             
            })

            this.modalHtmlElement.remove();                    //п3.89  удаляем наш элемент модального окна через remove
        })
    }

    createModalHtml({id, name, phone, email, address}) {       //п3.63  метод для создания модального окна, в который передаем параметры объекта
        const modalHtml = document.createElement('div');       //п3.64  создаем элемент модального окна  
        modalHtml.classList.add('modal');                      //п3.65  добавляем класс элементу  
        modalHtml.innerHTML = `<div class="modal__wrapper">
                                    <div class="modal__header">
                                        <h3 class="modal__title">Редактирование пользователя</h3>
                                    </div>
                                    <div class="modal__content">
                                        <div class="modal__edit">
                                            <h3 class="modal__edit__title">Имя:</h3>                                      
                                            <input type="text" class="modal__edit__name modal__input" placeholder="Имя" value="${name}">
                                        </div>
                                        <div class="modal__edit">
                                            <h3 class="modal__edit__title">Телефон</h3> 
                                            <input type="phone" class="modal__edit__phone modal__input" placeholder="Телефон" value="${phone}">
                                        </div>
                                        <div class="modal__edit">
                                            <h3 class="modal__edit__title">E-mail:</h3>                                         
                                            <input type="email" class="modal__edit__email modal__input" placeholder="E-mail" value="${email}">
                                        </div>
                                        <div class="modal__edit">
                                            <h3 class="modal__edit__title">Адрес:</h3> 
                                            <input type="text" class="modal__edit__address modal__input" placeholder="Адрес" value="${address}">
                                        </div>
                                        <div class="modal__btns">
                                            <button class="modal__cancel__btn btn">Отмена</button>
                                            <button class="modal__save__btn btn" id="${id}">Сохранить</button>
                                        </div>
                                    </div>
                                </div>`                       //п3.66  создаем HTML-структуру модального окна  
        return modalHtml;                                     //п3.67  возвращвем элемент модального окна
    }
}

const app = new ContactsApp();