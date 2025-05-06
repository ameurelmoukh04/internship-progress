$(document).ready(function () {
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
                        {% if task.status == 'Completed' %}mark as Pending{% else %}mark as Completed
                        {% endif %}
                    </button>
                    </td>
                    <td>
                    <button class='delete' data-id="{{ task.id }}">Delete</button>
                    <td>
                </tr>`)
        });
    })

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

    $('.delete').on('click', function (e) {
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

    $('.add').on('click', function (e) {
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

    $(document).on('submit', function (e) {
        e.preventDefault();
        const name = $(this).find('input[name="name"]').val();
        const details = $(this).find('textarea[name="details"]').val();
        console.log(name, details);

        $.ajax({
            url: '/add-task',
            method: 'POST',
            data: {
                name: name,
                details: details
            },
        }).then((response) => {
            $.ajax({
                url: '/tasks',
                method: 'GET',
            }).then((response) => {
                console.log(response)
            })

        })
    })


})