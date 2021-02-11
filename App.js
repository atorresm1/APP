const botones = document.querySelector('#botones')
const nombreUsuario = document.querySelector('#nombreUsuario')
const contenidoProtegido = document.querySelector('#contenidoProtegido')
const formulario = document.querySelector('#formulario')
const inputChat = document.querySelector('#inputChat')
    
firebase.auth().onAuthStateChanged( user => {
    if(user){
        console.log(user)
        botones.innerHTML = /*html*/`
        <button class="btn btn-outline-danger" id ='btnCerrarSesion'>Cerrar Sesion</button>
        `
        nombreUsuario.innerHTML = user.displayName
        cerrarSesion()
        contenidoProtegido.innerHTML = /*html*/`
            <p class="text-center lead mt-5"> Bienvenido ${user.email}</p>
        `
        formulario.classList = 'input-group py-3 fixed-bottom container'
        contenidoChat(user)

    }else{
        console.log('no existe user')
        botones.innerHTML = /*html*/`
            <button class="btn btn-outline-success mr-2" id='btnAcceder'>Acceder</button>

        `
        iniciarsesion()
        nombreUsuario.innerHTML = 'Chat'
        contenidoProtegido.innerHTML = /*html*/`
            <p class="text-center lead mt-5"> Debes de Iniciar Sesion</p>
        `
        formulario.classList = 'input-group py-3 fixed-bottom container d-none'
    
    }
})

const contenidoChat = (user) => {
    
    formulario.addEventListener('submit', (e)=> {
        e.preventDefault()
        console.log('inputchat.value')
        if(!inputChat.Value.trim()){
            console.log('input vacio')
            return
        }  

        firebase.firestore().collection('chat').add({
            texto : inputChat.Value,
            uid : user.uid,
            fecha : Date.now()
        })    
            .them(res => {console.log('Mensaje guardado')}) 
            .catch(e => console.log(e))

        inputChat.Value = ''


    })


    firebase.firestore().collection('chat').orderBy('fecha')
    .onSnapshot(query => {
       // console.log(query)
       contenidoProtegido.innerHTML = ''
        query.forEach(doc => {
            console.log(doc.data())
            if(doc.data().uid === user.uid){
                contenidoProtegido += `
                    <div class="d-flex d-flex justify-content-end">
                    <span class="badge badge-pill badge-primary">${doc.data().texto}</span>
                    </div>
                
                `
            }else{
                contenidoProtegido.innerHTML += `
                    <div class="d-flex d-flex justify-content-start">
                    <span class="badge badge-pill badge-secondary"> ${doc.data().texto}</span>
                    </div>
                
                `
            }
            contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight
        })
    })
}

const CerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#cerrarSesion')
    btnCerrarSesion.addEventListener.addEventListener('clik' , () => {
        firebase.auth().signOuth()
    })
}

const iniciarsesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('clik', async() => {
        console.log('Acabas de dar clik en acceder')
        try {
           const provider = new firebase.auth.GoogleAuthProvider()
           await firebase.auth().signInWithPopup(provider)

        } catch (error) {
            console.log(error)
        }

    })

}