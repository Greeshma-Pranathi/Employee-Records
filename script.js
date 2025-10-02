$(document).ready(function () {
  const table = $("#dataTable");
  const tbody = table.find("tbody");
  const rows = tbody.find("tr");
  let currentPage = 1;
  const rowsPerPage = 10;
  let filteredRows = rows.toArray();
  let sortDirection = {}; // store asc/desc per column

  // ----------------------
  // Pagination Functions
  // ----------------------
  function displayPage(page) {
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    tbody.empty();

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const rowsToDisplay = filteredRows.slice(start, end);

    rowsToDisplay.forEach(row => tbody.append(row));
    $("#pageInfo").text(`Page ${page} of ${totalPages}`);
    currentPage = page;
  }

  $("#prevPage").click(() => displayPage(currentPage - 1));
  $("#nextPage").click(() => displayPage(currentPage + 1));

  // ----------------------
  // Filtering
  // ----------------------
  $(".filters input, .filters select").on("input change", function () {
    const filterValues = $(".filters input, .filters select").map(function () {
      return $(this).val().toLowerCase();
    }).get();

    filteredRows = rows.filter(function () {
      return $(this).find("td").toArray().every((td, i) => {
        const cellText = $(td).text().toLowerCase();
        const filterValue = filterValues[i];

        if (!filterValue) return true;

        const filterInput = $(".filters th").eq(i).find("input, select");

        if (filterInput.is("select")) {
          // Exact match for dropdowns
          return cellText === filterValue;
        } else {
          // Partial match for text inputs
          return cellText.includes(filterValue);
        }
      });
    }).toArray();

    displayPage(1);
  });

  // ----------------------
  // Sorting
  // ----------------------
  $(".sortable").on("click", function () {
    const index = $(this).index();

    // reset arrows
    $(".sortable").removeClass("asc desc");

    // toggle sort direction
    sortDirection[index] = !sortDirection[index];

    // add arrow indicator
    $(this).addClass(sortDirection[index] ? "asc" : "desc");

    filteredRows.sort((a, b) => {
      const aText = $(a).find("td").eq(index).text().toLowerCase();
      const bText = $(b).find("td").eq(index).text().toLowerCase();

      if (!isNaN(Date.parse(aText)) && !isNaN(Date.parse(bText))) {
        return sortDirection[index]
          ? new Date(aText) - new Date(bText)
          : new Date(bText) - new Date(aText);
      } else if (!isNaN(aText) && !isNaN(bText)) {
        return sortDirection[index]
          ? aText - bText
          : bText - aText;
      } else {
        return sortDirection[index]
          ? aText.localeCompare(bText)
          : bText.localeCompare(aText);
      }
    });

    displayPage(1);
  });

  // ----------------------
  // Clear Filters Button
  // ----------------------
  $("#clearFilters").click(function() {
    $(".filters input, .filters select").val(""); // reset all inputs
    filteredRows = rows.toArray(); // reset filteredRows
    displayPage(1); // go back to first page
  });

  // ----------------------
  // Init
  // ----------------------
  displayPage(1);
});
