from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt

# Criando uma imagem base
img_width, img_height = 1200, 1600
background_color = (255, 255, 255)
image = Image.new("RGB", (img_width, img_height), background_color)
draw = ImageDraw.Draw(image)

# Cores
title_color = (30, 30, 30)
section_title_color = (60, 90, 160)
text_color = (50, 50, 50)
box_color = (230, 230, 250)

# Fonte
try:
    font_title = ImageFont.truetype("arial.ttf", 36)
    font_section = ImageFont.truetype("arial.ttf", 28)
    font_text = ImageFont.truetype("arial.ttf", 22)
except:
    font_title = font_section = font_text = None

# Função para desenhar seção com título
def draw_section(title, content_lines, y_offset):
    padding = 20
    line_height = 30
    box_height = (len(content_lines) + 1) * line_height + padding * 2
    draw.rectangle([(50, y_offset), (img_width - 50, y_offset + box_height)], fill=box_color)
    draw.text((70, y_offset + padding), title, fill=section_title_color, font=font_section)
    for i, line in enumerate(content_lines):
        draw.text((90, y_offset + padding + (i + 1) * line_height), line, fill=text_color, font=font_text)
    return y_offset + box_height + 30

# Título principal
draw.text((50, 40), "Painel Semântico – MedSystem", fill=title_color, font=font_title)

# Seções
y = 120
y = draw_section("🧾 Menu Lateral - Navegação", [
    "• Visão Geral → Página atual (dashboard)",
    "• Pacientes → Listagem e gerenciamento de pacientes",
    "• Novo Paciente → Cadastro de paciente",
    "• Consultas → Agendamento e histórico de consultas",
    "• Exames → Solicitação e acompanhamento de exames",
    "• Receitas → Emissão de receitas",
    "• Relatórios → Estatísticas e exportações",
    "• Sair → Logout do sistema"
], y)

y = draw_section("📊 Indicadores do Sistema – Resumo Rápido", [
    "Pacientes Ativos: 127",
    "Consultas Hoje: 23",
    "Exames Pendentes: 8",
    "Receitas Emitidas: 15"
], y)

y = draw_section("📅 Consultas de Hoje – Lista com Status", [
    "09:00 – Maria Santos – Consulta – Confirmada",
    "10:30 – José Oliveira – Retorno – Aguardando",
    "14:00 – Ana Costa – Consulta – Cancelada",
    "15:30 – Carlos Silva – Exame – Concluída"
], y)

y = draw_section("📌 Atividades Recentes – Linha do Tempo", [
    "Hoje, 14:30 – Receita Emitida: Losartana 50mg para Maria Santos Silva",
    "Hoje, 13:45 – Exame Solicitado: Hemograma completo para José Oliveira Costa"
], y)

# Exibir a imagem
plt.figure(figsize=(12, 16))
plt.imshow(image)
plt.axis("off")
plt.tight_layout()
plt.show()
