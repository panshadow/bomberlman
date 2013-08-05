-module(bomberlman_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================

start(_StartType, _StartArgs) ->
  Index = {
    "/", cowboy_static, [
      {directory, {priv_dir, bomberlman, []} },
      {file, "index.html"},
      {mimetypes, {fun mimetypes:path_to_mimes/2, default}}
    ]
  },
  Static = {
      "/[...]", cowboy_static, [
        {directory, {priv_dir, bomberlman, [] }},
        {mimetypes, {fun mimetypes:path_to_mimes/2, default}}
      ]
    },
  NotFound = {'_', bomberlman_404, []},
  WebSockets = { "/ws/", bomberlman_ws, []},
  Dispatch = cowboy_router:compile([
    {'_', [
      Index, 
      WebSockets,
      Static,
      NotFound
    ]}
  ]),
  Port = 8000,
  {ok, _} = cowboy:start_http(http_listener,100,
    [{port, Port}],
    [{env, [{dispatch, Dispatch}]}]
  ),
  bomberlman_sup:start_link().

stop(_State) ->
  ok.
