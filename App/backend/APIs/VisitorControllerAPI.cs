// VisitorController.cs
using backend.Database;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace backend.Server.Controllers
{
    [ApiController]
    [Route("api/visitor")]
    public class VisitorController : ControllerBase
    {
        private readonly VisitorDatabaseController _controller;

        public VisitorController(VisitorDatabaseController controller)
        {
            _controller = controller;
        }

        #region VISITOR

        [HttpPost("add")]
        public async Task<ActionResult> AddVisitor([FromBody] Visitor visitor)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool isAdded = await _controller.AddVisitor(visitor);
            if (!isAdded)
                return BadRequest("Unable to add visitor.");

            // Return the visitor ID after it is successfully added
            return Ok(new { VisitorId = visitor.ID });
        }


        // Get visitor by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Visitor>> GetVisitorById(int id)
        {
            var visitor = await _controller.GetVisitorById(id);

            if (visitor == null)
                return NotFound("Visitor not found.");

            return Ok(visitor);
        }

        // Get all visitors
        [HttpGet("all")]
        public async Task<ActionResult> GetAllVisitors()
        {
            var visitors = await _controller.GetAllVisitors();
            return Ok(visitors);
        }

        #endregion
    }
}
