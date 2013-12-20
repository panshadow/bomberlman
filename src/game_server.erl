-module(game_server).
-behaviour(gen_server).

-export([start/1, init/1, handle_call/3, handle_cast/2, handle_info/2,
  terminate/2, code_change/3]).

-record(gs, {clients=[], id}).

start(GameId) -> gen_server:start(?MODULE, #gs{id=GameId}, []).

init(State) -> {ok, State}.

handle_call({join, Name}, From, State) ->
  Clients = State#gs.clients,
  lists:map(fun({_, {Pid,_Ref}}) -> 
        Pid ! {game, State#gs.id, new, Name} end, 
        Clients),
  NewState = State#gs{clients=[{Name,From}|Clients]},
  {reply, {game, State#gs.id, ok}, NewState}.

handle_cast(ping, State) -> 
  {noreply, State}.

handle_info(Msg, State) -> 
  {noreply, State}.


terminate(normal, _State) -> ok.

code_change(_OldVsn, State, _Extra) -> {ok, State}.