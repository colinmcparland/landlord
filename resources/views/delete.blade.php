@extends('layouts.base')

@section('title', '- Delete Review')

@section('content')
<div class="placeholder-map"></div>
<ol class="breadcrumb">
  <li><a href="/">Home</a></li>
  <li class='active'>Delete Review</li>
</ol>
<div class="content">
  <h2>{{ $message }}</h2>
  <a href="@php echo secure_url('/'); @endphp"><p>&laquo; Back Home</p></a>
  @stop
</div>