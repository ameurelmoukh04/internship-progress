
function fetchAllItems() {
    $.ajax({
        url: "/tasks-api",
        method: "GET"
    }).then((response) => {
        let $myTable = $('#myTable').DataTable();
        $myTable.clear();
        response.items.forEach(task => {
            console.log(task.image)
            $myTable.row.add([
                task.name,
                task.details,
                `<span class="status">${task.status}</span>`,
                `<image class="img-fluid" src="http://127.0.0.1:8000/uploads/${task.image}" style="max-width: 100px; height: auto;"/>`,
                `<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
                    <button class="btn btn-primary toggle" data-id="${task.id}">
                        ${task.status === 'Completed' ? 'mark as Pending' : 'mark as Completed'}
                    </button>
                    <button class="btn btn-danger delete" data-id="${task.id}">Delete</button>
                </div>`
            ]);
        }
        );
        $myTable.draw();
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

                const $button = $(this);
                const $id = $(this).data('id');
                $table = $('#myTable').DataTable()
                const row = $table.row($button.closest('tr'));
                $.ajax({
                    url: `/tasks/${$id}/delete`,
                    method: 'DELETE',
                    data: { id: $id }
                }).then((response) => {
                    if (response.status === 200) {
                        row.remove().draw();
                    }else{
                        alert('there is an error');
                    }
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
          <div class="mb-3 d-flex justify-content-end">
          <button type="button" class="btn btn-secondary ms-2" data-bs-dismiss="modal" id="closeButton">Close</button>
          <button type="submit" class="btn btn-primary submitButton">Submit</button>
</div>
        </form>
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
        var formData = new FormData(document.getElementById('modalForm'));


        const name = $('#task-name').val();
        const details = $('#task-details').val();
        if (name.trim().length == 0 || details.trim().length == 0) {
            alert('fields are empty')
        } else {
            $.ajax({
                url: '/add-task',
                method: 'POST',
                data: formData,
                processData: false,
                contentType: false,
            }).then((response) => {
                const $myTable = $("#myTable").DataTable();
                $myTable.clear().draw();
                fetchAllItems();
                $('#closeButton').click();


            })
        }
    })


})