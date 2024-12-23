using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/data")]
    public class DataPanelController : ControllerBase
    {
        private readonly DataPanelDatabaseController _controller;

        public DataPanelController(DataPanelDatabaseController dataPanelController)
        {
            _controller = dataPanelController;
        }

        [HttpGet("guide/{UID}")]
        public async Task<IActionResult> GetGuideData(int UID)
        {
            var result = await _controller.GetGuideData(UID);

            if (result == null)
            {
                return BadRequest("User not found");
            }
            return Ok(result);
        }
    }
}
