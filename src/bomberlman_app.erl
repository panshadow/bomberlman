-module(bomberlman_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%% ===================================================================
%% Application callbacks
%% ===================================================================


get_ienv(Name, Default) ->
  case os:getenv(Name) of
    false -> Default;
    Val -> case string:to_integer(Val) of
      {error, _} -> Default;
      {NVal,_} -> NVal
    end
  end.

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
  Port = get_ienv("BOMBERLMAN_PORT",9000),
  {ok, _} = cowboy:start_http(http_listener,100,
    [{port, Port}],
    [{env, [{dispatch, Dispatch}]}]
  ),
  bomberlman_sup:start_link().

stop(_State) ->
  ok.
