function fetchAllItems(){
    $.ajax({
        url: "/tasks-test",
        method: "GET"
    }).then((response) => {
        const $tbody = $('.tbody');
        response.items.forEach(task => {
            console.log(task)
            $tbody.append(`
                <tr>
                    <td><h1>${task.name}</h1></td>
                    <td>
                        <h3 class='status'>${task.status}</h3>
                    </td>
                    <td>
                        <button class="toggle" data-id="${task.id}">
                            ${task.status === 'Completed' ? 'mark as Pending' : 'mark as Completed'}
                        </button>
                    </td>
                    <td>
                        <button class='delete' data-id="${task.id}">Delete</button>
                    </td>
                </tr>
            `);
        });
    })
}
$(document).ready(function () {
    fetchAllItems()

    $(document).on('click', '.toggle', function (e) {
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

    $(document).on('click', '.delete', function (e) {
        e.preventDefault();
        const $id = $(this).data('id');
        const $thisbutton = $(this);
        const $parent = $thisbutton.parent().parent();
        $.ajax({
            url: `/tasks/${$id}/delete`,
            method: 'POST',
            data: { id: $id }
        }).then((response) => {

            if (response.status === 200) {
                console.log(response)
                $parent.remove()
                return;
            }
            alert('there is an error');
        })
    })

    $(document).on('click', '.add', function (e) {
        e.preventDefault();
        const $newHtml = `
                <form >
                    <label for="name">Name :</label>
                    <input type="text" name="name" id="name" required>

                    <label for="details">Details :</label>
                    <textarea name="details" id="details" required></textarea>

                    <button type='submit'>Add task</button>
                </form>
            `;
        $('.newForm').html($newHtml)
    })

    $(document).on('submit','.newForm', function (e) {
        e.preventDefault();
        const name = $(this).find('input[name="name"]').val();
        const details = $(this).find('textarea[name="details"]').val();

        $.ajax({
            url: '/add-task',
            method: 'POST',
            data: {
                name: name,
                details: details
            },
        }).then((response) => {
            $tbody = $('.tbody');
            $tbody.empty();
            fetchAllItems();

        })
    })


})