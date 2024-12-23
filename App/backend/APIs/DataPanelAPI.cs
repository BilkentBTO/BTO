/// <summary>
/// Controller for managing data related to the guide, such as retrieving guide data by UID.
/// </summary>
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing data related to the guide, such as retrieving guide data by UID.
    /// Constraints:
    /// - The `UID` parameter must be a valid user identifier that exists in the database.
    /// </summary>
    [ApiController]
    [Route("api/data")]
    public class DataPanelController : ControllerBase
    {
        private readonly DataPanelDatabaseController _controller;

        /// <summary>
        /// Initializes the controller with the given data panel database controller.
        /// </summary>
        /// <param name="dataPanelController">The DataPanelDatabaseController instance for interacting with the database.</param>
        public DataPanelController(DataPanelDatabaseController dataPanelController)
        {
            _controller = dataPanelController;
        }

        // <summary>
        /// Retrieves guide data for the specified UID.
        /// </summary>
        /// <param name="UID">The unique identifier of the guide.</param>
        /// <returns>A response containing the guide data or an error message if the guide is not found.</returns>
        [HttpGet("guide/{UID}")]
        public async Task<IActionResult> GetGuideData(int UID)
        {
            if (UID < 0)
            {
                return BadRequest("Wrong User ID");
            }
            var result = await _controller.GetGuideData(UID);
            if (result == null)
            {
                return BadRequest("User data not found");
            }
            return Ok(result);
        }

        [HttpGet("guide")]
        public async Task<IActionResult> GetAllGuideData()
        {
            var result = await _controller.GetAllGuideData();
            return Ok(result);
        }

        [HttpGet("school")]
        public async Task<IActionResult> GetSchoolData()
        {
            var result = await _controller.GetSchoolData();

            if (result == null)
            {
                return BadRequest("School data not found");
            }
            return Ok(result);
        }
    }
}
