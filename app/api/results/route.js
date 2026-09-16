import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import QuizResult from "@/models/QuizResult";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const id = searchParams.get("id");

    if (id) {
      const result = await QuizResult.findById(id).lean();

      if (!result) {
        return NextResponse.json({ error: "Résultat introuvable" }, { status: 404 });
      }

      return NextResponse.json({ success: true, result });
    }

    if (name) {
      // Retourne le dernier résultat de cette personne
      const result = await QuizResult.findOne({ name: name.trim() })
        .sort({ completedAt: -1 })
        .lean();

      if (!result) {
        return NextResponse.json(
          { error: "Aucun résultat trouvé pour " + name },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, result });
    }

    // Retourne tous les résultats pour le dashboard
    const results = await QuizResult.find({})
      .sort({ completedAt: -1 })
      .lean();

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("❌ Erreur results:", error);
    return NextResponse.json(
      { error: "Erreur serveur : " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Paramètre id requis" }, { status: 400 });
    }

    const deleted = await QuizResult.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Résultat introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur delete result:", error);
    return NextResponse.json(
      { error: "Erreur serveur : " + error.message },
      { status: 500 }
    );
  }
}
