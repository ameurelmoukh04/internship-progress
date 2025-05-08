

function fetchAllItems() {
    $.ajax({
        url: "/tasks-api",
        method: "GET"
    }).then((response) => {
        const $myTable = $('#myTable').DataTable();
        response.items.forEach(task => {
            $myTable.row.add([
                task.name,
                task.details,
                `<span class="status">${task.status}</span>`,
                `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
                    <button class="toggle" data-id="${task.id}">
                        ${task.status === 'Completed' ? 'mark as Pending' : 'mark as Completed'}
                    </button>
                    <button class="delete" data-id="${task.id}">Delete</button>
                </div>`
            ]).draw();

        }
        );
        $('#myTable').DataTable()
    })
}

$(document).ready(function () {
    fetchAllItems()

    $(document).on('click', '.toggle', function (e) {
        e.preventDefault();
        const $button = $(this);
        const id = $button.data('id');
        const $row = $(this).parent().parent().parent();
        const $statusText = $row.find('.status');
        console.log($statusText.text())

        Swal.fire({
            title: "Are you sure?",
            text: `You want to mark this Task as ${$statusText.text() == 'Completed' ? 'Pending' : 'Completed'}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {

            if (result.isConfirmed) {

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
                Swal.fire({
                    title: "Updated!",
                    text: `Your Task has been Marked as ${$statusText.text() == 'Completed' ? 'Pending' : 'Completed'}.`,
                    icon: "success"
                });
            }
        });

    });

    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                const $id = $(this).data('id');
                const $thisbutton = $(this);
                const $parent = $thisbutton.parent().parent().parent();
                $.ajax({
                    url: `/tasks/${$id}/delete`,
                    method: 'POST',
                    data: { id: $id }
                }).then((response) => {

                    if (response.status === 200) {
                        $parent.remove()
                        return;
                    }
                    alert('there is an error');
                })
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Task has been deleted.",
                    icon: "success"
                });
            }
        });
    })

    let status = false;
    $('.btn').on('click', function (e) {
        e.preventDefault();
        status = !status;
        const $newHtml = `
<div class="modal" tabindex="-1" id="exampleModal">
 <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Add New Task</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form class="modalForm" enctype="multipart/form-data" id="modalForm">
          <div class="mb-3">
            <label for="recipient-name" name="name" class="col-form-label">Title :</label>
            <input type="text" class="form-control" id="task-name" name="name">
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">Description :</label>
            <textarea class="form-control" name="details" id="task-details"></textarea>
          </div>
          <div class="mb-3">
            <label for="message-text" class="col-form-label">Image :</label>
            <input type="file" class="form-control" id="task-image" name="image">
          </div>
          <button type="submit" class="btn btn-primary submitButton" >Submit</button>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="closeButton">Close</button>
      </div>
    </div>
  </div>
</div>
        `;
        $('body').append($newHtml);
        const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
        modal.show();
    })

    $(document).on('submit', '.modalForm', function (e) {
        e.preventDefault();
        //const form = ;
        var formData = new FormData(document.getElementById('modalForm'));
        
        // for(const[key, value] of formData.entries()){
        //     console.log(`key ${key} : ${value}`)
        // }
        
        
        const name = $('#task-name').val();
        const details = $('#task-details').val();
        if (name.trim().length == 0 || details.trim().length == 0) {
            alert('fields are empty')
        } else {
            $.ajax({
                url: '/add-task',
                method: 'POST',
                data: formData,
            }).then((response) => {
                $tbody = $('.tbody');
                const $myTable = $("#myTable").DataTable();
                $myTable.clear().draw();
                fetchAllItems();
                $('#closeButton').click();


            })
        }
    })


})