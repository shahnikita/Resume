using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace GamingHtml.Hubs
{
    public class GameHub : Hub
    {
        /// <summary>
        /// The count of users connected.
        /// </summary>
        public static List<string> Users = new List<string>();

        public void SendMove(int indicator)
        {
            string cplayer=GetCurrentPlayer();

            Clients.All.setPlayerMove(indicator, Users.IndexOf(cplayer));
        }

        public void Send(int count)
        {
            // Call the addNewMessageToPage method to update clients.
            var context = GlobalHost.ConnectionManager.GetHubContext<GameHub>();
            context.Clients.All.updateUsersOnlineCount(count);
        }



        public override Task OnConnected() {
            if (Users.Count > 1)
            {
                return base.OnDisconnected();
            }
            else {

                Users.Add(Context.QueryString["username"]);
                Clients.Caller.setCurrentPlayer(Users.IndexOf(Context.QueryString["username"]));
                Send(Users.Count);
            }
            
            //// Send the current count of users
            //Send(Users.Count);

            return base.OnConnected();
        
        }

        public override Task OnDisconnected() {
            Users.Remove(Context.QueryString["username"]);
            Send(Users.Count);
            return base.OnDisconnected();
        }

        /// <summary>
        /// Get's the currently connected Id of the client.
        /// This is unique for each client and is used to identify
        /// a connection.
        /// </summary>
        /// <returns>The client Id.</returns>
        private string GetCurrentPlayer()
        {
            string clientId = "";
            if (Context.QueryString["username"] != null)
            {
                // clientId passed from application 
                clientId = this.Context.QueryString["username"];
            }

            if (string.IsNullOrEmpty(clientId.Trim()))
            {
                clientId = Context.ConnectionId;
            }

            return clientId;
        }
    }
}