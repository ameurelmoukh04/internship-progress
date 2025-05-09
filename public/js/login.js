$(document).ready(function (){
    $('.btn').on('click', function (e){
        e.preventDefault();
        $email = $('#exampleInputEmail1').val()
        $password = $('#exampleInputPassword1').val()
        if($email.length < 5 || $password.length < 5){
            alert('data not filled');
        }
        console.log($email,$password)

        
    })
}
)