
function checkUserStatus(auth) {

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uid = user.uid;

        } else {
            window.location.replace("login.html");
        }
    });

    var userRead = sessionStorage.getItem('userses') || localStorage.getItem('user');
    if (userRead === null) {
        try {
            auth.signOut();
            window.location.replace("login.html");
        } catch (error) {
            console.error(error);
        }
    }
}
  
export { checkUserStatus };
  