$(document).ready(function () {

    $('.toggle').on('click', function (e) {
        e.preventDefault();
        const id = $(this).data('id');
        const $button = $(this);
        const $row = $button.closest('tr');
        const $statusText = $row.find('h3');
        $.ajax({
            url: `/tasks/${id}/update`,
            method: 'POST',
            data: { id: id }
        }).then(function (response) {
            if (response === 'Updated') {
                if ($button.text().trim() == 'mark as Pending') {
                    $button.text('mark as Completed')
                    $statusText.text('Pending')
                } else {
                    $button.text('mark as Pending')
                    $statusText.text('Completed')
                }
            }

        });
    });

    $('.delete').on('click',function(e){
        e.preventDefault();
        const $id = $(this).data('id');
        const $thisbutton = $(this);
        const $parent = $thisbutton.parent().parent();
        $.ajax({
            url:`/tasks/${$id}/delete`,
            method:'GET',
            data: {id:$id}
        }).then((response) =>{

            if(response.status === 200){
                console.log(response)
                $parent.remove()
                return;
            }
            alert('there is an error');
        })
    })


})