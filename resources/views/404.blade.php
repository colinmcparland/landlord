@extends('layouts.base')

@section('title', '- Delete Review')

@section('content')
<div class="placeholder-map"></div>
<ol class="breadcrumb">
  <li><a href="/">Home</a></li>
  <li class='active'>{{ $title }}</li>
</ol>
<div class="content">
  <h2>{{ $message }}</h2>
  <a class="btn btn-default" href="@php echo secure_url('/'); @endphp">&laquo; Back Home</a>
  @stop
</div>